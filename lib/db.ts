import { createClient, type Client } from "@libsql/client";
import path from "node:path";
import fs from "node:fs";
import { NICHE_LEARNING } from "@/data/niche-learning";

// Local dev: file-based SQLite (data/nexus.db).
// Deployed (Vercel etc.): TURSO_DATABASE_URL + TURSO_AUTH_TOKEN → cloud SQLite.
const TURSO_URL = process.env.TURSO_DATABASE_URL;
const isRemote = !!TURSO_URL;

if (!isRemote) {
  fs.mkdirSync(path.join(process.cwd(), "data"), { recursive: true });
}

const client: Client = isRemote
  ? createClient({ url: TURSO_URL, authToken: process.env.TURSO_AUTH_TOKEN })
  : createClient({ url: "file:data/nexus.db" });

type SQLValue = string | number | bigint | boolean | Uint8Array | null;

// The free-tier Turso endpoint (and serverless networks in general) can drop
// connections under load or while the DB is cold/waking up. Retry transient
// failures a couple of times before giving up, and treat a malformed result
// as an empty result instead of crashing the page.
const MAX_ATTEMPTS = 3;

function isTransientError(e: unknown): boolean {
  if (!(e instanceof Error)) return false;
  const msg = e.message;
  return (
    msg.includes("fetch failed") ||
    msg.includes("ETIMEDOUT") ||
    msg.includes("ECONNRESET") ||
    msg.includes("ECONNREFUSED") ||
    msg.includes("socket hang up") ||
    msg.includes("HRANA_") ||
    msg.includes("SERVER_ERROR") ||
    msg.includes("database is closed") ||
    msg.includes("Connection reset")
  );
}

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let attempt = 0;
  for (;;) {
    try {
      return await fn();
    } catch (e) {
      attempt++;
      if (attempt >= MAX_ATTEMPTS || !isTransientError(e)) throw e;
      await new Promise((r) => setTimeout(r, attempt * 250));
    }
  }
}

function toRows<T>(rows: unknown): Array<T> {
  return Array.isArray(rows) ? (rows as Array<T>) : [];
}

export interface Statement {
  run(...args: SQLValue[]): Promise<{ changes: number; lastInsertRowid: number | bigint }>;
  get<T = Record<string, unknown>>(...args: SQLValue[]): Promise<T | null>;
  all<T = Record<string, unknown>>(...args: SQLValue[]): Promise<Array<T>>;
}

export const db = {
  async exec(sql: string) {
    await ensureInit();
    await withRetry(() => client.executeMultiple(sql));
  },
  prepare(sql: string): Statement {
    return {
      async run(...args) {
        await ensureInit();
        const r = await withRetry(() => client.execute({ sql, args }));
        return { changes: r.rowsAffected, lastInsertRowid: r.lastInsertRowid ?? 0 };
      },
      async get<T>(...args: SQLValue[]) {
        await ensureInit();
        const r = await withRetry(() => client.execute({ sql, args }));
        return (toRows<T>(r.rows)[0]) ?? null;
      },
      async all<T>(...args: SQLValue[]) {
        await ensureInit();
        const r = await withRetry(() => client.execute({ sql, args }));
        return toRows<T>(r.rows);
      },
    };
  },
};

let initPromise: Promise<void> | null = null;

// Internal helpers — used ONLY inside init()/migrate()/seeds.
// They talk to the client directly and must NOT go through the public
// db object (which awaits ensureInit() and would deadlock on itself).
function rawPrepare(sql: string): Statement {
  return {
    async run(...args) {
      await client.execute({ sql, args });
      return { changes: 0, lastInsertRowid: 0 };
    },
    async get<T>(...args: SQLValue[]) {
      const r = await client.execute({ sql, args });
      return (r.rows[0] as T) ?? null;
    },
    async all<T>(...args: SQLValue[]) {
      const r = await client.execute({ sql, args });
      return r.rows as unknown as Array<T>;
    },
  };
}

function ensureInit(): Promise<void> {
  if (!initPromise) {
    initPromise = init().catch((e) => {
      initPromise = null;
      throw e;
    });
  }
  return initPromise;
}

async function init() {
  if (!isRemote) {
    await client.execute("PRAGMA busy_timeout = 8000").catch(() => {});
    await client.execute("PRAGMA journal_mode = WAL").catch(() => {});
    await client.execute("PRAGMA synchronous = NORMAL").catch(() => {});
  }

  await client.executeMultiple(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL DEFAULT '',
    plan TEXT NOT NULL DEFAULT 'free',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS password_resets (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS quiz_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz TEXT NOT NULL CHECK (quiz IN ('readiness', 'niche')),
    result TEXT NOT NULL,
    payload TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS progress (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    stage TEXT NOT NULL DEFAULT 'umpisa',
    checks TEXT NOT NULL DEFAULT '{}',
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL DEFAULT 'Community',
    role TEXT NOT NULL DEFAULT '',
    quote TEXT NOT NULL,
    badge TEXT NOT NULL DEFAULT 'Community',
    status TEXT NOT NULL DEFAULT 'approved',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS apply_sites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Marketplace',
    description TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS portfolios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL DEFAULT '',
    bio TEXT NOT NULL DEFAULT '',
    skills TEXT NOT NULL DEFAULT '[]',
    experience TEXT NOT NULL DEFAULT '',
    links TEXT NOT NULL DEFAULT '[]',
    avatar_url TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS certificates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stage_key TEXT NOT NULL,
    stage_title TEXT NOT NULL,
    date_issued TEXT NOT NULL DEFAULT (date('now')),
    UNIQUE(user_id, stage_key)
  );

  CREATE TABLE IF NOT EXISTS daily_plan_progress (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    day INTEGER NOT NULL,
    done INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, day)
  );

  CREATE TABLE IF NOT EXISTS niches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    overview TEXT NOT NULL DEFAULT '',
    rate_range TEXT NOT NULL DEFAULT '',
    job_titles TEXT NOT NULL DEFAULT '[]'
  );

  CREATE TABLE IF NOT EXISTS niche_resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    niche_key TEXT NOT NULL REFERENCES niches(key) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'Guide',
    description TEXT NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    provider TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    badge TEXT NOT NULL DEFAULT 'Free',
    category TEXT NOT NULL DEFAULT 'Marketing',
    difficulty TEXT NOT NULL DEFAULT 'Beginner',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT NOT NULL DEFAULT '',
    url TEXT NOT NULL,
    niche TEXT NOT NULL DEFAULT 'admin',
    description TEXT NOT NULL DEFAULT '',
    source TEXT NOT NULL DEFAULT 'sample',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS job_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT '',
    platform TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'applied',
    applied_date TEXT NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invoice_number TEXT NOT NULL DEFAULT '',
    client_name TEXT NOT NULL DEFAULT '',
    client_email TEXT NOT NULL DEFAULT '',
    line_items TEXT NOT NULL DEFAULT '[]',
    currency TEXT NOT NULL DEFAULT 'USD',
    due_date TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent','paid')),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS weekly_checkins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    week_start TEXT NOT NULL,
    applications_sent INTEGER NOT NULL DEFAULT 0,
    note TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, week_start)
  );

  CREATE TABLE IF NOT EXISTS skill_quiz_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_key TEXT NOT NULL,
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    passed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, skill_key)
  );

  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS user_streaks (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_activity_date TEXT
  );

  CREATE TABLE IF NOT EXISTS user_badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_type TEXT NOT NULL,
    earned_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, badge_type)
  );

  CREATE TABLE IF NOT EXISTS ai_usage_daily (
    date TEXT PRIMARY KEY,
    count INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS ai_usage_monthly (
    user_id INTEGER NOT NULL,
    month TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, month),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS ai_chat_usage (
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, date),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS account_deletion_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS referrals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    referrer_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referred_user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    referral_sequence_number INTEGER NOT NULL,
    commission_amount INTEGER NOT NULL DEFAULT 0,
    referred_upgraded_at TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    referred_ip TEXT
  );

  CREATE TABLE IF NOT EXISTS referral_codes (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS referral_balances (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_earned INTEGER NOT NULL DEFAULT 0,
    unredeemed_balance INTEGER NOT NULL DEFAULT 0,
    redeemed_via_cash INTEGER NOT NULL DEFAULT 0,
    redeemed_via_subscription_credit INTEGER NOT NULL DEFAULT 0,
    total_successful_referrals INTEGER NOT NULL DEFAULT 0,
    redemption_preference TEXT NOT NULL DEFAULT 'auto_subscription'
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL DEFAULT 'signup',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    meta TEXT NOT NULL DEFAULT '{}',
    read INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    emailed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS announcement_reads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    announcement_id INTEGER NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    read_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(announcement_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS referral_redemptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    redemption_type TEXT NOT NULL CHECK (redemption_type IN ('cash', 'subscription_credit')),
    amount INTEGER NOT NULL,
    redeemed_at TEXT NOT NULL DEFAULT (datetime('now')),
    status TEXT NOT NULL DEFAULT 'pending'
  );

  CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    method TEXT NOT NULL DEFAULT 'gcash',
    reference TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'active',
    amount INTEGER NOT NULL DEFAULT 299,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS rate_limits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL,
    timestamp INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS site_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS email_verifications (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT NOT NULL DEFAULT '/',
    visitor_id TEXT NOT NULL DEFAULT '',
    user_agent TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS active_users (
    visitor_id TEXT PRIMARY KEY,
    last_seen INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS user_onboarding (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    experience_level TEXT NOT NULL DEFAULT '',
    main_goal TEXT NOT NULL DEFAULT '',
    weekly_hours TEXT NOT NULL DEFAULT '',
    interests TEXT NOT NULL DEFAULT '[]',
    completed_at INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL DEFAULT '',
    metadata TEXT NOT NULL DEFAULT '{}',
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log(user_id, created_at DESC);

  CREATE TABLE IF NOT EXISTS portfolio_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    portfolio_id INTEGER NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    visitor_id TEXT NOT NULL DEFAULT '',
    path TEXT NOT NULL DEFAULT '',
    referrer TEXT NOT NULL DEFAULT '',
    user_agent TEXT NOT NULL DEFAULT '',
    created_at INTEGER NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_portfolio_views_port ON portfolio_views(portfolio_id, created_at DESC);

  CREATE TABLE IF NOT EXISTS portfolio_link_clicks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    portfolio_id INTEGER NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    link_label TEXT NOT NULL DEFAULT '',
    link_url TEXT NOT NULL DEFAULT '',
    visitor_id TEXT NOT NULL DEFAULT '',
    created_at INTEGER NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS portfolio_link_clicks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    portfolio_id INTEGER NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    link_label TEXT NOT NULL DEFAULT '',
    link_url TEXT NOT NULL DEFAULT '',
    visitor_id TEXT NOT NULL DEFAULT '',
    created_at INTEGER NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_portfolio_clicks_port ON portfolio_link_clicks(portfolio_id, created_at DESC);

  CREATE TABLE IF NOT EXISTS rate_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    slug TEXT NOT NULL UNIQUE,
    headline TEXT NOT NULL DEFAULT '',
    intro TEXT NOT NULL DEFAULT '',
    currency TEXT NOT NULL DEFAULT 'USD',
    packages TEXT NOT NULL DEFAULT '[]',
    faq TEXT NOT NULL DEFAULT '[]',
    contact_note TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_rate_cards_user ON rate_cards(user_id);
`);

// Note: tables created in later sessions that aren't in the CREATE block above:
//   users.va_score, users.niche_preferences, users.email_verified, users.updates_opt_in,
//   users.role, job_applications.source_url, job_applications.follow_up_date,
//   jobs.rate_range, jobs.client_type, apply_sites.platform_type, apply_sites.niche_tags,
//   user_streaks, user_badges, ai_usage, ai_chat_usage, activity_log
// are handled by the idempotent migrations below.

/* ============ MIGRATIONS ============ */

async function columnExists(table: string, column: string): Promise<boolean> {
  const cols = (await rawPrepare(`PRAGMA table_info(${table})`).all()) as Array<{ name: string }>;
  return cols.some((c) => c.name === column);
}

// Idempotent column add — guards against races between concurrent build workers
async function addColumn(table: string, column: string, ddl: string) {
  if (await columnExists(table, column)) return;
  try {
    await client.executeMultiple(`ALTER TABLE ${table} ADD COLUMN ${ddl}`);
  } catch (e) {
    if (!(e instanceof Error && e.message.includes("duplicate column name"))) throw e;
  }
}

async function migrate() {
  await addColumn("users", "va_score", "va_score INTEGER NOT NULL DEFAULT 0");
  await addColumn("users", "niche_preferences", "niche_preferences TEXT NOT NULL DEFAULT '[]'");
  await addColumn("users", "email_verified", "email_verified INTEGER NOT NULL DEFAULT 0");
  await addColumn("users", "updates_opt_in", "updates_opt_in INTEGER NOT NULL DEFAULT 0");
  await addColumn("users", "role", "role TEXT NOT NULL DEFAULT 'user'");
  await addColumn("users", "last_reminder_sent_at", "last_reminder_sent_at TEXT");
  await addColumn("users", "referred_by", "referred_by INTEGER");
  await addColumn("users", "donate_popup_last_shown_at", "donate_popup_last_shown_at TEXT");
  await addColumn("job_applications", "source_url", "source_url TEXT NOT NULL DEFAULT ''");
  await addColumn("job_applications", "follow_up_date", "follow_up_date TEXT");
  await addColumn("jobs", "rate_range", "rate_range TEXT NOT NULL DEFAULT ''");
  await addColumn("jobs", "client_type", "client_type TEXT NOT NULL DEFAULT ''");
  await addColumn("courses", "pro_only", "pro_only INTEGER NOT NULL DEFAULT 0");
  await addColumn("courses", "related_niches", "related_niches TEXT NOT NULL DEFAULT '[]'");
  await addColumn("portfolios", "layout", "layout TEXT NOT NULL DEFAULT 'classic'");
  await addColumn("portfolios", "accent_color", "accent_color TEXT NOT NULL DEFAULT ''");
  await addColumn("portfolios", "resume_url", "resume_url TEXT NOT NULL DEFAULT ''");
  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS course_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'started',
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, course_id)
    );
    CREATE INDEX IF NOT EXISTS idx_course_progress_user ON course_progress(user_id);
  `);
  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS onboarding_checklist_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      item_num TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 1,
      UNIQUE(user_id, item_num)
    );
    CREATE INDEX IF NOT EXISTS idx_onboarding_checklist_user ON onboarding_checklist_progress(user_id);
  `);
  if (!(await columnExists("apply_sites", "platform_type"))) {
    await addColumn("apply_sites", "platform_type", "platform_type TEXT NOT NULL DEFAULT 'job_board'");
    await addColumn("apply_sites", "niche_tags", "niche_tags TEXT NOT NULL DEFAULT '[]'");
    // new schema — re-seed so rows get platform_type and niche_tags
    await client.executeMultiple("DELETE FROM apply_sites");
  }
  // Onboarding & activity tables (created in later sessions)
  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS user_onboarding (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      experience_level TEXT NOT NULL DEFAULT '',
      main_goal TEXT NOT NULL DEFAULT '',
      weekly_hours TEXT NOT NULL DEFAULT '',
      interests TEXT NOT NULL DEFAULT '[]',
      completed_at INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      title TEXT NOT NULL DEFAULT '',
      metadata TEXT NOT NULL DEFAULT '{}',
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
    CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log(user_id, created_at DESC);
  `);

  // Portfolio v2 columns
  await addColumn("portfolios", "projects", "projects TEXT NOT NULL DEFAULT '[]'");
  await addColumn("portfolios", "theme", "theme TEXT NOT NULL DEFAULT 'minimal'");
  await addColumn("portfolios", "custom_slug", "custom_slug TEXT NOT NULL DEFAULT ''");
  await addColumn("portfolios", "tagline", "tagline TEXT NOT NULL DEFAULT ''");
  await addColumn("portfolios", "location", "location TEXT NOT NULL DEFAULT ''");
  await addColumn("portfolios", "availability", "availability TEXT NOT NULL DEFAULT ''");
  await addColumn("portfolios", "languages", "languages TEXT NOT NULL DEFAULT '[]'");
  await addColumn("portfolios", "timezone_info", "timezone_info TEXT NOT NULL DEFAULT ''");
  await addColumn("portfolios", "response_time", "response_time TEXT NOT NULL DEFAULT ''");
  await addColumn("portfolios", "portfolio_views_count", "portfolio_views_count INTEGER NOT NULL DEFAULT 0");
  await addColumn("portfolios", "avatar_url", "avatar_url TEXT NOT NULL DEFAULT ''");
}

/* ============ SEEDS ============ */

async function seedApplySites() {
  const count = ((await rawPrepare("SELECT COUNT(*) AS n FROM apply_sites").get()) as { n: number }).n;
  if (count > 0) return;

  const insert = rawPrepare(
    "INSERT INTO apply_sites (name, url, category, description, platform_type, niche_tags) VALUES (?, ?, ?, ?, ?, ?)"
  );
  // platform_type: job_board | marketplace | agency
  // niche_tags: JSON array — 'all' if applicable to everyone
  const sites: Array<[string, string, string, string, string, string]> = [
    ["OnlineJobs.ph", "https://www.onlinejobs.ph", "Philippine Marketplace", "The biggest job platform for Filipino VAs. Direct hire — you deal with the client yourself. Free account.", "job_board", "all"],
    ["Upwork", "https://www.upwork.com", "Global Marketplace", "Global platform. Start with small fixed-price projects to build profile history.", "marketplace", "all"],
    ["Fiverr", "https://www.fiverr.com", "Global Marketplace", "Gig-based — sell your services as packages. Great for content, social media, and admin tasks.", "marketplace", "[\"social\",\"content\",\"admin\",\"customer\"]"],
    ["Freelancer.com", "https://www.freelancer.com", "Global Marketplace", "Project-based platform. Many categories — from data entry to web development.", "marketplace", "all"],
    ["Guru", "https://www.guru.com", "Global Marketplace", "Older platform with fixed-price and hourly projects. Less competition than Upwork.", "marketplace", "all"],
    ["PeoplePerHour", "https://www.peopleperhour.com", "Global Marketplace", "Great for content writers, designers, and admin support. Job postings link directly to your skills.", "marketplace", "[\"content\",\"admin\",\"social\"]"],
    ["Toptal", "https://www.toptal.com", "Global Marketplace", "High-end marketplace with strict screening. For those with a strong portfolio already.", "marketplace", "[\"admin\",\"bookkeeping\",\"content\"]"],
    ["99designs", "https://99designs.com", "Global Marketplace", "For designers — contests and direct projects. A possible entry into the content/design niche.", "marketplace", "[\"content\"]"],
    ["Dribbble", "https://dribbble.com", "Global Marketplace", "Portfolio platform for designers — clients see your work before they even talk to you.", "marketplace", "[\"content\"]"],
    ["Behance", "https://www.behance.net", "Global Marketplace", "Adobe's portfolio platform — a good place to display design work.", "marketplace", "[\"content\"]"],
    ["LinkedIn Jobs", "https://www.linkedin.com/jobs", "Global Job Board", "Two uses: job hunting and personal branding. Optimize your profile to appear in recruiter searches.", "job_board", "all"],
    ["Indeed (Global)", "https://www.indeed.com", "Global Job Board", "The biggest job search engine. Filter for 'Remote' for WFH roles.", "job_board", "all"],
    ["Indeed PH", "https://ph.indeed.com", "Philippine Job Board", "Local version of Indeed — remote and office-based roles in the Philippines.", "job_board", "all"],
    ["Jobstreet PH", "https://www.jobstreet.com.ph", "Philippine Job Board", "One of the most widely used job boards in the Philippines. Has a 'Work From Home' filter.", "job_board", "all"],
    ["Kalibrr", "https://www.kalibrr.com", "Philippine Job Board", "PH-focused job platform with a clean interface and in-app application tracker.", "job_board", "all"],
    ["Foundit (Monster PH)", "https://www.foundit.ph", "Philippine Job Board", "Formerly Monster PH — local and remote roles.", "job_board", "all"],
    ["Remote.co", "https://remote.co", "Global Job Board", "100% remote jobs only. Has categories for VA and customer support.", "job_board", "all"],
    ["We Work Remotely", "https://weworkremotely.com", "Global Job Board", "Large remote-only job board. Has admin, customer support, and copywriting sections.", "job_board", "[\"admin\",\"customer\",\"content\"]"],
    ["FlexJobs", "https://www.flexjobs.com", "Global Job Board", "Verified remote and flexible jobs. Membership costs money — know that it's legit and not a 'job scam'.", "job_board", "all"],
    ["Dynamite Jobs", "https://www.dynamitejobs.com", "Global Job Board", "Remote jobs for North American companies. Offers bespoke matching.", "job_board", "[\"admin\",\"customer\"]"],
    ["Remotive", "https://remotive.com", "Global Job Board", "Remote jobs with a community newsletter. Has VA and customer support categories.", "job_board", "[\"admin\",\"customer\",\"content\"]"],
    ["Remote OK", "https://remoteok.com", "Global Job Board", "Remote jobs aggregator with broad role coverage.", "job_board", "all"],
    ["Himalayas", "https://himalayas.app", "Global Job Board", "Modern remote job board with salary transparency.", "job_board", "all"],
    ["Working Nomads", "https://www.workingnomads.com", "Global Job Board", "Curated remote jobs for digital nomads — including admin and content roles.", "job_board", "[\"content\",\"admin\"]"],
    ["Wellfound (AngelList)", "https://wellfound.com", "Global Job Board", "Startup-focused — many early-stage companies hire generalist VAs.", "job_board", "[\"admin\",\"customer\"]"],
    ["VirtualStaff.ph", "https://www.virtualstaff.ph", "Philippine Agency", "Philippine staffing agency matching remote staff to international clients. Job access costs money.", "agency", "all"],
    ["Remote Rocketship", "https://www.remoterocketship.com", "Philippine Agency", "Platform that guides your application through the hiring process — with tools for interview prep.", "agency", "all"],
    ["Athena", "https://athenahome.com", "Direct Hire (Agency)", "Hires executive assistants for US clients. Fixed salary package. Good for experienced candidates or strong communicators.", "agency", "[\"admin\"]"],
    ["Wing Assistant", "https://www.wingassistant.com", "Direct Hire (Agency)", "US-based company hiring dedicated assistants. Structured application process.", "agency", "[\"admin\",\"customer\",\"social\"]"],
    ["BruntWork", "https://www.bruntwork.co", "Direct Hire (Agency)", "Australian company hiring Filipino remote workers for various roles.", "agency", "all"],
    ["Somewhere", "https://www.somewhere.com", "Direct Hire (Agency)", "For long-term direct hire. What you look for here is different: a client with a clear process and a long-term plan.", "agency", "all"],
    ["Staffing Solutions PH", "https://www.staffingsolutions.ph", "Philippine Agency", "Local agency connecting Filipino VAs to international clients.", "agency", "[\"admin\",\"customer\"]"],
    ["MyStaffingHub", "https://www.mystaffinghub.com", "Philippine Agency", "Remote staffing agency for small businesses — admin and bookkeeping roles.", "agency", "[\"admin\",\"bookkeeping\"]"],
    ["Outsourcey", "https://www.outsourcey.com", "Philippine Agency", "Australian-PH agency with a variety of VA roles.", "agency", "all"],
    ["SupportNinja", "https://www.supportninja.com", "Direct Hire (Agency)", "B2B outsourcing company — customer support and social media management roles.", "agency", "[\"customer\",\"social\"]"],
    ["Magic", "https://www.getmagic.com", "Direct Hire (Agency)", "US-based with dedicated assistant packages. Strong onboarding process.", "agency", "[\"admin\",\"customer\"]"],
    ["Pearl Talent", "https://www.pearltalent.com", "Direct Hire (Agency)", "Global talent agency — executive assistants and bookkeepers for US companies.", "agency", "[\"admin\",\"bookkeeping\"]"],
    ["HireRocket", "https://www.hirerocket.com", "Philippine Agency", "PH agency with full-time and part-time VA placements.", "agency", "[\"admin\"]"],
    ["VAStaffer", "https://www.vastaffer.com", "Philippine Agency", "Virtual assistant staffing for US small businesses.", "agency", "[\"admin\"]"],
    ["CloudEmployee", "https://www.clouemployee.com", "Direct Hire (Agency)", "Global outsourcing firm with fixed VA service packages.", "agency", "all"],
    ["TaskBullet", "https://www.taskbullet.com", "Direct Hire (Agency)", "Offshore staffing with clear packages — admin support focus.", "agency", "[\"admin\"]"],
    ["Remote Staff", "https://www.remotestaff.com.au", "Philippine Agency", "Australian-owned agency connecting Filipino VAs with AU clients.", "agency", "all"],
    ["GoTeam", "https://www.goteam.com", "Direct Hire (Agency)", "Global company with a large PH workforce — customer support and admin roles.", "agency", "[\"customer\",\"admin\"]"],
    ["iRemote", "https://www.iremote.ph", "Philippine Agency", "Filipino-owned remote staffing agency with a good reputation in the community.", "agency", "all"],
    ["Filta", "https://www.filta.com.au", "Philippine Agency", "Australian agency with Filipino VAs — admin and executive assistant roles.", "agency", "[\"admin\"]"],
    ["Phoenix Support", "https://www.phoenixsupport.net", "Direct Hire (Agency)", "Specializes in executive assistants for the real estate and coaching industries.", "agency", "[\"admin\"]"],
    ["Velpryr", "https://www.velpryr.com", "Philippine Agency", "PH-based offering various VA service packages.", "agency", "all"],
    ["Jobrack", "https://www.jobrack.com", "Philippine Agency", "Filipino staffing agency hiring remote talent for US and AU clients.", "agency", "all"],
    ["Stealth Agents", "https://stealthagents.com", "Direct Hire (Agency)", "Remote staffing with customer service and admin support roles.", "agency", "[\"admin\",\"customer\"]"],
    ["FreeUp", "https://www.freeup.net", "Global Marketplace", "Curated marketplace — freelancers are approved before they can apply to clients.", "marketplace", "all"],
    ["DOXA Talent", "https://doxatalent.com", "Direct Hire (Agency)", "Filipino-founded staffing firm placing VAs with US companies. Strong training support.", "agency", "all"],
    ["Cloudstaff", "https://www.cloudstaff.com", "Philippine Agency", "Long-running PH remote staffing company with offices here and clear career tracks.", "agency", "[\"admin\",\"customer\"]"],
    ["TalentHero", "https://www.talenthero.org", "Direct Hire (Agency)", "Hires Filipino VAs as dedicated employees for US clients — equipment and benefits included.", "agency", "all"],
    ["Manila Recruitment", "https://www.manilarecruitment.com", "Direct Hire (Agency)", "PH headhunting firm placing local talent in executive and specialist roles.", "agency", "[\"admin\"]"],
    ["OneCore", "https://www.onecore.ph", "Philippine Agency", "PH staffing agency — web design, admin, and VA placements.", "agency", "all"],
    ["Outsource Access", "https://www.outsourceaccess.com", "Direct Hire (Agency)", "US-based outsourcing firm hiring Filipino staff for back-office and admin roles.", "agency", "[\"admin\",\"customer\"]"],
    ["RemotePanda", "https://www.remotepanda.com", "Direct Hire (Agency)", "Hires full-time remote staff for US clients — VA and specialized roles.", "agency", "all"],
    ["J-K Network Services", "https://www.jknetworkjobs.com", "Direct Hire (Agency)", "PH recruitment agency with job placement for local and remote roles.", "agency", "all"],
    ["Global Staffing (The Remote Group)", "https://www.globalstaffing.com.ph", "Philippine Agency", "PH staffing company hiring for various back-office and VA roles.", "agency", "all"],
    ["BELAY", "https://belaysolutions.com", "Direct Hire (Agency)", "US company hiring experienced virtual assistants, bookkeepers, and social media managers.", "agency", "[\"admin\",\"bookkeeping\",\"social\"]"],
    ["Time Etc", "https://timeetc.com", "Direct Hire (Agency)", "UK-based — hires experienced VAs for long-term assistant roles.", "agency", "[\"admin\"]"],
    ["Fancy Hands", "https://fancyhands.com", "Direct Hire (Agency)", "US company with simple task-based assistant work — a good entry point for beginners.", "agency", "[\"admin\"]"],
    ["OkayRelax", "https://www.okayrelax.com", "Direct Hire (Agency)", "US-based hiring Filipino VAs for part-time and full-time assistant roles.", "agency", "[\"admin\"]"],
    ["Trusty Oak", "https://trustyoak.com", "Direct Hire (Agency)", "US virtual assistant agency hiring for admin, marketing, and customer support roles.", "agency", "[\"admin\",\"social\",\"customer\"]"],
    ["MyOutDesk", "https://myoutdesk.com", "Direct Hire (Agency)", "US agency with dedicated VAs for real estate and business support.", "agency", "[\"admin\",\"customer\"]"],
    ["UAssistMe", "https://www.uassistme.com", "Direct Hire (Agency)", "Hires executive assistants for US clients — strong remote onboarding program.", "agency", "[\"admin\"]"],
    ["Penbrothers", "https://penbrothers.com", "Philippine Agency", "PH agency offering full-time remote careers across admin, tech, and creative roles.", "agency", "all"],
    ["HireTalent", "https://hirtalent.com", "Philippine Agency", "PH staffing firm matching talent with US and AU companies.", "agency", "all"],
    ["Telus Digital", "https://www.telusdigital.com", "BPO / Call Center", "One of the world's biggest BPOs — customer service and tech support, many WFH roles.", "agency", "[\"customer\"]"],
    ["Concentrix", "https://www.concentrix.com", "BPO / Call Center", "Global BPO with PH sites and work-from-home customer support roles.", "agency", "[\"customer\"]"],
    ["Foundever", "https://www.foundever.com", "BPO / Call Center", "Large global BPO (formerly Sitel) with PH hubs and WFH opportunities.", "agency", "[\"customer\"]"],
    ["TaskUs", "https://www.taskus.com", "BPO / Call Center", "PH-founded BPO known for strong culture — customer support, content moderation, and tech roles.", "agency", "[\"customer\",\"content\",\"social\"]"],
    ["Alorica", "https://www.alorica.com", "BPO / Call Center", "Global BPO with PH sites — customer service and sales support roles.", "agency", "[\"customer\"]"],
    ["Sutherland", "https://www.sutherlandglobal.com", "BPO / Call Center", "Global BPO offering customer support and back-office roles, including WFH setups.", "agency", "[\"customer\",\"admin\"]"],
    ["ResultsCX", "https://www.resultscx.com", "BPO / Call Center", "BPO focused on customer experience — PH hiring with remote options.", "agency", "[\"customer\"]"],
    ["VXI Global Solutions", "https://www.vxi.com", "BPO / Call Center", "BPO with PH hubs — customer support and content moderation roles.", "agency", "[\"customer\",\"content\"]"],
    ["TTEC", "https://www.ttec.com", "BPO / Call Center", "Global BPO hiring PH talent for customer experience and tech support.", "agency", "[\"customer\"]"],
    ["Cognizant", "https://www.cognizant.com", "BPO / Call Center", "Global IT and BPO services company with PH operations and remote roles.", "agency", "[\"customer\"]"],
    ["Accenture PH", "https://www.accenture.com/ph-en", "BPO / Call Center", "Global tech and outsourcing company with PH hubs — support and tech roles.", "agency", "[\"customer\"]"],
    ["OpenAccess BPO", "https://www.openaccessbpo.com", "BPO / Call Center", "PH-based BPO with flexible and WFH customer support roles.", "agency", "[\"customer\"]"],
  ];
  for (const s of sites) await insert.run(...s);
}

async function seedNiches() {
  const nicheCount = ((await rawPrepare("SELECT COUNT(*) AS n FROM niches").get()) as { n: number }).n;
  const resCount = ((await rawPrepare("SELECT COUNT(*) AS n FROM niche_resources").get()) as { n: number }).n;
  if (nicheCount > 0 && resCount > 0) return;

  const insertNiche = rawPrepare(
    "INSERT INTO niches (key, title, overview, rate_range, job_titles) VALUES (?, ?, ?, ?, ?)"
  );
  const insertResource = rawPrepare(
    "INSERT INTO niche_resources (niche_key, title, url, type, description) VALUES (?, ?, ?, ?, ?)"
  );

  if (nicheCount === 0) {
    for (const n of NICHE_LEARNING) {
      await insertNiche.run(n.key, n.title, n.overview, n.rate_range, JSON.stringify(n.job_titles));
    }
  }
  if (resCount === 0) {
    for (const n of NICHE_LEARNING) {
      for (const r of n.resources) {
        await insertResource.run(n.key, r.title, r.url, r.type, r.description);
      }
    }
  }
}

async function seedJobs() {
  const count = ((await rawPrepare("SELECT COUNT(*) AS n FROM jobs").get()) as { n: number }).n;
  if (count > 0) return;

  const insert = rawPrepare(
    "INSERT INTO jobs (title, company, url, niche, description, source) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const jobs: Array<[string, string, string, string, string, string]> = [
    ["Executive Assistant for a Real Estate CEO", "Sample Co.", "https://www.onlinejobs.ph", "admin", "Email and calendar management, travel booking, CRM updates. 20-40 hrs/week, experience preferred.", "sample"],
    ["Social Media Manager for E-commerce Brand", "Sample Co.", "https://www.onlinejobs.ph", "social", "Content calendar, Reels, and engagement for Instagram and TikTok. Canva and CapCut basics required.", "sample"],
    ["Shopify Virtual Assistant", "Sample Co.", "https://www.upwork.com", "ecommerce", "Product listing, order processing, and customer chats for a Shopify store.", "sample"],
    ["Part-time Bookkeeper (Xero)", "Sample Co.", "https://www.upwork.com", "bookkeeping", "Bank reconciliation and invoicing using Xero. 10 hrs/week. Training provided.", "sample"],
    ["Customer Support Rep (Email/Chat)", "Sample Co.", "https://www.remotive.com", "customer", "Inbound support for a SaaS product. Full-time, remote, PH timezone-friendly.", "sample"],
    ["SEO Blog Content Writer", "Sample Co.", "https://www.freelancer.com", "content", "2-3 articles per week for a finance blog. SEO basics required.", "sample"],
  ];
  for (const j of jobs) await insert.run(...j);
}

async function seedTestimonials() {
  const count = ((await rawPrepare("SELECT COUNT(*) AS n FROM testimonials").get()) as { n: number }).n;
  if (count > 0) return;
  const insert = rawPrepare("INSERT INTO testimonials (name, role, quote, badge) VALUES (?, ?, ?, ?)");
  await insert.run(
    "—",
    "Your first win here",
    "This space is reserved. Over time it will be filled with real stories from the community — yours included.",
    "Reserved"
  );
  await insert.run(
    "—",
    "Whatever it takes",
    "When you have a story — first client, first month, first rate increase — share it. That will be the most honest proof that this path works.",
    "Reserved"
  );
}

async function seedCourses() {
  const count = ((await rawPrepare("SELECT COUNT(*) AS n FROM courses").get()) as { n: number }).n;
  if (count > 0) return;

  const insert = rawPrepare(
    "INSERT INTO courses (title, provider, url, description, badge, category, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  // badge: Free | Audit (free to audit, certificate costs money) | Trial
  const courses: Array<[string, string, string, string, string, string, string]> = [
    ["Fundamentals of Digital Marketing", "Google", "https://learndigital.withgoogle.com/digitalgarage/course/digital-marketing", "26 modules of digital marketing basics: SEO, social media, ads, analytics. The most popular free certification for beginners.", "Free", "Marketing", "Beginner"],
    ["Google Workspace Training", "Google", "https://workspace.google.com/training/", "Official tutorials for Gmail, Docs, Sheets, Slides, and Calendar. Needed for almost every VA role.", "Free", "Productivity Tools", "Beginner"],
    ["Google Digital Marketing & E-commerce Certificate", "Coursera", "https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce", "7 courses with hands-on projects. You can audit for free; only the official certificate costs money.", "Audit", "Marketing", "Beginner"],
    ["Google IT Support Certificate", "Coursera", "https://www.coursera.org/professional-certificates/google-it-support", "Introduction to IT support, troubleshooting, and networking. A great extra skill for remote work.", "Audit", "Data & Tech", "Intermediate"],
    ["Google Data Analytics Certificate", "Coursera", "https://www.coursera.org/professional-certificates/google-data-analytics", "Learn SQL, spreadsheets, and Tableau. You can audit for free if you're not ready for the certificate yet.", "Audit", "Data & Tech", "Intermediate"],
    ["Microsoft 365 Fundamentals (MS-900)", "Microsoft", "https://learn.microsoft.com/en-us/training/courses/ms-900t00", "Official training path for Microsoft 365: Outlook, Teams, OneDrive, and more. Training modules are free.", "Free", "Productivity Tools", "Beginner"],
    ["Microsoft Learn: Power BI Training", "Microsoft", "https://learn.microsoft.com/en-us/training/paths/create-use-analytics-reports-power-bi/", "Build reports and dashboards in Power BI. A high-demand skill for executive assistant roles.", "Free", "Data & Tech", "Intermediate"],
    ["Microsoft Learn: Browse All Courses", "Microsoft", "https://learn.microsoft.com/en-us/training/browse/?products=microsoft-365", "The full library of free Microsoft training: Excel, Outlook, Teams, Word. Filter by your skill level.", "Free", "Productivity Tools", "Beginner"],
    ["HubSpot Inbound Marketing", "HubSpot", "https://academy.hubspot.com/courses/inbound-marketing", "The most recommended free certification for marketing. Official certificate you can link on LinkedIn.", "Free", "Marketing", "Beginner"],
    ["HubSpot Email Marketing", "HubSpot", "https://academy.hubspot.com/courses/email-marketing", "How to build email campaigns that convert. Free certificate and official badge.", "Free", "Marketing", "Beginner"],
    ["HubSpot Social Media Marketing", "HubSpot", "https://academy.hubspot.com/courses/social-media", "Social media strategy from planning to reporting. Free with a certificate.", "Free", "Marketing", "Beginner"],
    ["HubSpot SEO Certification", "HubSpot", "https://academy.hubspot.com/courses/seo", "How search engine optimization works: keywords, content, and technical SEO.", "Free", "Marketing", "Intermediate"],
    ["HubSpot Content Marketing", "HubSpot", "https://academy.hubspot.com/courses/content-marketing", "Create content that matters to your audience. Free certificate from HubSpot Academy.", "Free", "Marketing", "Beginner"],
    ["HubSpot CRM Certification", "HubSpot", "https://academy.hubspot.com/courses/overview-crm", "Master the CRM: one of the most in-demand skills among clients hiring VAs.", "Free", "CRM & Sales", "Beginner"],
    ["Work Smarter with Microsoft Excel", "Coursera", "https://www.coursera.org/learn/work-smarter-microsoft-excel", "Free to audit. Excel fundamentals with graded assignments for the certificate.", "Audit", "Productivity Tools", "Beginner"],
    ["Google Project Management Certificate", "Coursera", "https://www.coursera.org/professional-certificates/google-project-management", "For those who want to focus on project management as a VA specialty. Audit mode is free.", "Audit", "Career & Freelancing", "Intermediate"],
    ["English for Career Development", "Coursera", "https://www.coursera.org/learn/careerdevelopment", "From the University of Pennsylvania. Helps you with your resume, cover letter, and interview in English.", "Audit", "Career & Freelancing", "Beginner"],
    ["Diploma in Virtual Assistance", "Alison", "https://alison.com/course/diploma-in-virtual-assistance", "100% free, from start to diploma-level certificate. Covers basic VA skills and responsibilities.", "Free", "Career & Freelancing", "Beginner"],
    ["Alison: Administrative Assistant Courses", "Alison", "https://alison.com/tag/administrative-assistant", "Free courses on administrative management, bookkeeping, and office skills. All with certificates.", "Free", "Career & Freelancing", "Beginner"],
    ["Salesforce Trailhead", "Salesforce", "https://trailhead.salesforce.com/", "Salesforce's free learning platform. Trailhead badges are a big boost on your resume for CRM-focused roles.", "Free", "CRM & Sales", "Beginner"],
    ["Meta Blueprint: Digital Marketing", "Meta", "https://www.facebook.com/business/learn", "Meta's official courses for Facebook and Instagram ads. Certifications are also offered.", "Free", "Marketing", "Intermediate"],
    ["freeCodeCamp: Responsive Web Design", "freeCodeCamp", "https://www.freecodecamp.org/learn/2022/responsive-web-design/", "For those who want to learn to code. Free certification — you need to finish the projects.", "Free", "Design & Web", "Beginner"],
    ["Canva Design School", "Canva", "https://www.canva.com/designschool/", "Free courses and certifications in graphic design using Canva. Perfect for social media gigs.", "Free", "Design & Web", "Beginner"],
    ["Trello Academy", "Trello", "https://training.trello.com/", "Official Trello certification: one of the most-used project management tools by clients.", "Free", "Productivity Tools", "Beginner"],
    ["Asana Academy", "Asana", "https://academy.asana.com/", "Free Asana certifications and courses. VAs who know Asana are in high demand.", "Free", "Productivity Tools", "Beginner"],
    ["ClickUp Academy", "ClickUp", "https://academy.clickup.com/", "Free course and certification for ClickUp: another popular project management tool.", "Free", "Productivity Tools", "Beginner"],
    ["LinkedIn Learning: Become a Virtual Assistant", "LinkedIn", "https://www.linkedin.com/learning/paths/become-a-virtual-assistant", "Learning path made up of courses for the VA career. 1-month free trial; cancel before you're charged.", "Trial", "Career & Freelancing", "Beginner"],
  ];
  for (const c of courses) await insert.run(...c);
}

async function seedSiteConfig() {
  const defaults: Record<string, string> = {
    marquee_text: "Welcome to Thrive! Running this site costs real money — a small donation helps us keep it free for everyone ☕",
    paypal_link: "https://paypal.me/PhillipWendyll",
    gcash_number: "09923999895",
  };
  for (const [key, value] of Object.entries(defaults)) {
    const existing = await rawPrepare("SELECT 1 FROM site_config WHERE key = ?").get(key);
    if (!existing) {
      await rawPrepare("INSERT INTO site_config (key, value) VALUES (?, ?)").run(key, value);
    }
  }
}

  await migrate();
  await seedApplySites();
  await seedNiches();
  await seedJobs();
  await seedTestimonials();
  await seedCourses();
  await seedSiteConfig();
}
