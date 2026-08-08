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