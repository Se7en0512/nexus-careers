import nodemailer from "nodemailer";

let warnedAboutConfig = false;

function getTransport() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    if (!warnedAboutConfig) {
      console.warn("[email] GMAIL_USER or GMAIL_APP_PASSWORD not set — skipping email send");
      warnedAboutConfig = true;
    }
    return null;
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

function getFromAddress() {
  const user = process.env.GMAIL_USER;
  return user ? `Thrive <${user}>` : "Thrive";
}

export async function sendVerificationEmail(email: string, token: string, appUrl: string): Promise<boolean> {
  const transport = getTransport();
  if (!transport) return false;

  const verifyLink = `${appUrl}/api/auth/verify?token=${token}`;

  try {
    await transport.sendMail({
      from: getFromAddress(),
      to: email,
      subject: "Verify your Thrive account",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #1a1a2e; margin-bottom: 16px;">Welcome to Thrive!</h2>
          <p style="color: #555; line-height: 1.6;">
            Thanks for signing up. Please verify your email address by clicking the button below:
          </p>
          <a href="${verifyLink}" style="display: inline-block; background: #D9A94E; color: #1a1a2e; padding: 12px 32px; border-radius: 4px; text-decoration: none; font-weight: bold; margin: 16px 0;">
            Verify Email
          </a>
          <p style="color: #999; font-size: 13px;">
            If you didn't create an account, you can ignore this email.
          </p>
          <p style="color: #999; font-size: 13px;">
            This link expires in 24 hours.
          </p>
        </div>
      `,
    });
    return true;
  } catch (e) {
    console.error("[email] Failed to send verification email", e);
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, resetLink: string): Promise<boolean> {
  const transport = getTransport();
  if (!transport) return false;

  try {
    await transport.sendMail({
      from: getFromAddress(),
      to: email,
      subject: "Reset your Thrive password",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #1a1a2e; margin-bottom: 16px;">Reset your password</h2>
          <p style="color: #555; line-height: 1.6;">
            We received a request to reset your Thrive password. Click the button below to choose a new one:
          </p>
          <a href="${resetLink}" style="display: inline-block; background: #D9A94E; color: #1a1a2e; padding: 12px 32px; border-radius: 4px; text-decoration: none; font-weight: bold; margin: 16px 0;">
            Reset Password
          </a>
          <p style="color: #999; font-size: 13px;">
            This link expires in 1 hour.
          </p>
          <p style="color: #999; font-size: 13px;">
            If you didn't request a password reset, you can ignore this email.
          </p>
        </div>
      `,
    });
    return true;
  } catch (e) {
    console.error("[email] Failed to send password reset email", e);
    return false;
  }
}

export interface FollowUpItem {
  company: string;
  role: string;
  daysSince: number;
}

export async function sendFollowUpReminderEmail(email: string, items: FollowUpItem[]): Promise<boolean> {
  const transport = getTransport();
  if (!transport) return false;

  const rowsHtml = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #333; font-size: 14px;">
            <strong>${item.role || "Application"}</strong> — ${item.company || "Unknown company"}
          </td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #999; font-size: 13px; text-align: right; white-space: nowrap;">
            ${item.daysSince} day${item.daysSince === 1 ? "" : "s"} since applied
          </td>
        </tr>`
    )
    .join("");

  try {
    await transport.sendMail({
      from: getFromAddress(),
      to: email,
      subject: `Time to follow up on ${items.length} job application${items.length === 1 ? "" : "s"}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #1a1a2e; margin-bottom: 16px;">Your weekly follow-up reminder</h2>
          <p style="color: #555; line-height: 1.6;">
            A few of your applications are due for a follow-up. A short, polite message
            can bump you back to the top of a busy inbox.
          </p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            ${rowsHtml}
          </table>
          <p style="color: #555; line-height: 1.6;">
            Not sure what to say? Use the client message templates on Thrive —
            <a href="https://thrive-ph.vercel.app/free-templates" style="color: #D9A94E;">grab one here</a>.
          </p>
          <p style="color: #999; font-size: 13px;">
            You get this reminder weekly. You can update your preferences anytime.
          </p>
        </div>
      `,
    });
    return true;
  } catch (e) {
    console.error("[email] Failed to send follow-up reminder email", e);
    return false;
  }
}

export async function sendAnnouncementEmail(email: string, title: string, message: string): Promise<boolean> {
  const transport = getTransport();
  if (!transport) return false;

  try {
    await transport.sendMail({
      from: getFromAddress(),
      to: email,
      subject: `New update from Thrive: ${title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #1a1a2e; margin-bottom: 16px;">${title}</h2>
          <p style="color: #555; line-height: 1.6; white-space: pre-line;">${message}</p>
          <a href="https://thrive-ph.vercel.app/dashboard" style="display: inline-block; background: #D9A94E; color: #1a1a2e; padding: 12px 32px; border-radius: 4px; text-decoration: none; font-weight: bold; margin: 16px 0;">
            Go to Dashboard
          </a>
          <p style="color: #999; font-size: 13px;">
            You're getting this because you opted in to Thrive updates. You can unsubscribe
            anytime from your dashboard settings.
          </p>
        </div>
      `,
    });
    return true;
  } catch (e) {
    console.error("[email] Failed to send announcement email", e);
    return false;
  }
}