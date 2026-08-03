export interface NicheResource {
  title: string;
  url: string;
  type: "Course" | "YouTube" | "Guide" | "Community";
  description: string;
}

export interface NicheLearning {
  key: string;
  title: string;
  overview: string;
  rate_range: string;
  job_titles: string[];
  resources: NicheResource[];
}

export const NICHE_LEARNING: NicheLearning[] = [
  {
    key: "admin",
    title: "Admin Support",
    overview:
      "You are the bridge between the client and their business — email, calendar, data entry, and all their other organizational tasks. This is the most accessible entry point for new VAs because most of the skills are learned on the job.",
    rate_range: "₱25,000–₱60,000/month (entry to experienced)",
    job_titles: [
      "Executive Assistant",
      "Administrative Assistant",
      "General Virtual Assistant",
      "Personal Assistant",
      "Data Entry Specialist",
    ],
    resources: [
      {
        title: "Google Workspace Learning Center",
        url: "https://workspace.google.com/learning-center/",
        type: "Course",
        description: "Free official training for Gmail, Docs, Sheets, and Drive — the daily toolkit of an admin VA.",
      },
      {
        title: "Simpletivity (YouTube)",
        url: "https://www.youtube.com/@Simpletivity",
        type: "YouTube",
        description: "A productivity channel covering practical Gmail, Calendar, and automation tips.",
      },
      {
        title: "Notion Guides",
        url: "https://www.notion.com/guides",
        type: "Guide",
        description: "Notion training — a tool many clients use for docs and project tracking.",
      },
      {
        title: "HubSpot Academy — Productivity",
        url: "https://academy.hubspot.com/",
        type: "Course",
        description: "Free time management and organization courses that apply directly to admin work.",
      },
    ],
  },
  {
    key: "social",
    title: "Social Media Management",
    overview:
      "You run the client's social media presence — content calendar, posts, captions, and engagement. It's popular with new VAs but more competitive — what sets you apart is the ability to create content, not just schedule it.",
    rate_range: "₱30,000–₱70,000/month (entry to experienced)",
    job_titles: [
      "Social Media Manager",
      "Community Manager",
      "Content Creator",
      "SMM Specialist",
      "Social Media VA",
    ],
    resources: [
      {
        title: "Meta Blueprint",
        url: "https://www.facebook.com/business/learn",
        type: "Course",
        description: "Free official Meta training for Facebook and Instagram — it even has a certification track.",
      },
      {
        title: "Canva Design School",
        url: "https://www.canva.com/learn/",
        type: "Course",
        description: "Practical Canva tutorials for social graphics — no design degree required.",
      },
      {
        title: "HubSpot Academy — Social Media",
        url: "https://academy.hubspot.com/courses/social-media",
        type: "Course",
        description: "Free course on social media strategy and content planning.",
      },
      {
        title: "Social Media Examiner (YouTube)",
        url: "https://www.youtube.com/@SocialMediaExaminer",
        type: "YouTube",
        description: "The latest trends and tactics for social media managers.",
      },
    ],
  },
  {
    key: "ecommerce",
    title: "E-commerce Support",
    overview:
      "You help online sellers — listings, orders, customer chats, and shop inventory. Demand keeps rising because of the boom in online selling. Your edge here: you know how Shopee, Lazada, Shopify, or Amazon works from a seller's point of view.",
    rate_range: "₱30,000–₱65,000/month (entry to experienced)",
    job_titles: [
      "E-commerce VA",
      "Amazon FBA VA",
      "Shopify Store Assistant",
      "Listing Specialist",
      "Online Seller Assistant",
    ],
    resources: [
      {
        title: "Shopify Academy",
        url: "https://www.shopify.com/academy",
        type: "Course",
        description: "Free courses on setting up and managing a Shopify store — from listings to marketing.",
      },
      {
        title: "Amazon Seller University",
        url: "https://sell.amazon.com/learn",
        type: "Course",
        description: "Amazon's official training for sellers — essential for FBA roles.",
      },
      {
        title: "Ecom Geeks (YouTube)",
        url: "https://www.youtube.com/@EcomGeeks",
        type: "YouTube",
        description: "Practical e-commerce tutorials — product research, listing optimization, and operations.",
      },
      {
        title: "Shopee Seller Center PH",
        url: "https://seller.shopee.ph/edu/",
        type: "Guide",
        description: "Free education straight from Shopee for Philippine sellers — essential for local e-commerce.",
      },
    ],
  },
  {
    key: "bookkeeping",
    title: "Bookkeeping",
    overview:
      "You take care of a business's numbers — transactions, invoices, and reconciliation for small businesses. This is one of the most in-demand and well-paid niches for Filipino VAs because many US and AU small businesses are looking for affordable bookkeepers.",
    rate_range: "₱35,000–₱80,000/month (entry to experienced)",
    job_titles: [
      "Bookkeeper",
      "Accounting VA",
      "QuickBooks Specialist",
      "Xero Bookkeeper",
      "Accounts Payable/Receivable VA",
    ],
    resources: [
      {
        title: "Intuit QuickBooks Training",
        url: "https://quickbooks.intuit.com/learn-support/",
        type: "Course",
        description: "Official tutorials and certification for QuickBooks Online — the most widely used bookkeeping tool.",
      },
      {
        title: "Xero Central",
        url: "https://central.xero.com/",
        type: "Course",
        description: "Xero's free training platform, with certification for advisors and bookkeepers.",
      },
      {
        title: "Intuit Academy Bookkeeping",
        url: "https://www.coursera.org/professional-certificates/bookkeeping",
        type: "Course",
        description: "A Coursera professional certificate in bookkeeping — each course can be audited for free.",
      },
      {
        title: "Accounting Stuff (YouTube)",
        url: "https://www.youtube.com/@AccountingStuff",
        type: "YouTube",
        description: "Clear explanations of basic accounting concepts — a solid foundation before the tools.",
      },
    ],
  },
  {
    key: "customer",
    title: "Customer Support",
    overview:
      "You're the first person to face the client's customers — chats, emails, calls, and resolving issues. Demand is huge because many businesses need 24/7 support. The most important skill here is communication and patience — which makes it a great path for anyone strong in the English language.",
    rate_range: "₱25,000–₱55,000/month (entry to experienced)",
    job_titles: [
      "Customer Service Representative",
      "Support Specialist",
      "Chat Support Agent",
      "Email Support Agent",
      "Dispute Resolution Specialist",
    ],
    resources: [
      {
        title: "Zendesk Training",
        url: "https://training.zendesk.com/",
        type: "Course",
        description: "Free training on Zendesk — one of the most widely used customer support platforms.",
      },
      {
        title: "HubSpot Academy — Service Hub",
        url: "https://academy.hubspot.com/courses/service-hub",
        type: "Course",
        description: "Free course on customer service management and support processes.",
      },
      {
        title: "Customer Service Training (Coursera)",
        url: "https://www.coursera.org/courses?query=customer%20service",
        type: "Course",
        description: "Free-to-audit courses on communication and customer service fundamentals.",
      },
      {
        title: "Jobberman PH — Customer Service Tips",
        url: "https://www.youtube.com/@jobbermanphilippines",
        type: "YouTube",
        description: "Local tips on BPO and customer service careers from Filipino trainers.",
      },
    ],
  },
  {
    key: "content",
    title: "Content & Copywriting",
    overview:
      "You write for the client's business — blogs, emails, scripts, and anything else needed for marketing. This is the niche where 'portfolio' takes the place of 'experience' — so it's accessible to those without experience, as long as you have strong portfolio samples.",
    rate_range: "₱30,000–₱75,000/month (entry to experienced)",
    job_titles: [
      "Copywriter",
      "Content Writer",
      "Blog Writer",
      "Email Copywriter",
      "SEO Content Specialist",
    ],
    resources: [
      {
        title: "HubSpot Academy — Content Marketing",
        url: "https://academy.hubspot.com/courses/content-marketing",
        type: "Course",
        description: "Free content marketing certification — solid proof of knowledge for a client.",
      },
      {
        title: "Copyblogger",
        url: "https://copyblogger.com/",
        type: "Guide",
        description: "A classic resource for copywriting fundamentals — dig through the archives for the lessons.",
      },
      {
        title: "Ahrefs Blog — SEO Copywriting",
        url: "https://ahrefs.com/blog/",
        type: "Guide",
        description: "Free guides on SEO and content strategy — important for writing gigs.",
      },
      {
        title: "The Futur (YouTube)",
        url: "https://www.youtube.com/@TheFutur",
        type: "YouTube",
        description: "Creative business education — including how to price creative work and talk to clients.",
      },
    ],
  },
];