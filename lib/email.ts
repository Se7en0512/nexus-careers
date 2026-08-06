import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function getFromAddress() {
  // Use custom domain if configured, otherwise fall back to Resend sandbox
  const domain = process.env.RESEND_FROM_DOMAIN;
  if (domain) return `Thrive <noreply@${domain}>`;
  return "Thrive <onboarding@resend.dev>";
}

export async function sendVerificationEmail(email: string, token: string, appUrl: string): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping verification email");
    return false;
  }

  const verifyLink = `${appUrl}/api/auth/verify?token=${token}`;
  const from = getFromAddress();

  try {
    const { data, error } = await resend.emails.send({
      from,
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

    if (error) {
      console.error("[email] Resend error:", JSON.stringify(error));
      return false;
    }

    console.log("[email] Verification email sent to", email, "— id:", data?.id);
    return true;
  } catch (e) {
    console.error("[email] Exception sending verification email:", e);
    return false;
  }
}
