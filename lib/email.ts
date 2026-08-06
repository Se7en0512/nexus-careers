import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function getFromAddress() {
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

  // DIAGNOSTIC LOGGING
  console.log("[email-diag] ═══════════════════════════════════════");
  console.log("[email-diag] RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);
  console.log("[email-diag] RESEND_API_KEY length:", process.env.RESEND_API_KEY?.length);
  console.log("[email-diag] RESEND_API_KEY prefix:", process.env.RESEND_API_KEY?.substring(0, 8) + "...");
  console.log("[email-diag] RESEND_FROM_DOMAIN:", process.env.RESEND_FROM_DOMAIN || "(not set)");
  console.log("[email-diag] APP_URL:", appUrl);
  console.log("[email-diag] FROM address:", from);
  console.log("[email-diag] TO address:", email);
  console.log("[email-diag] TOKEN:", token);
  console.log("[email-diag] VERIFY URL:", verifyLink);
  console.log("[email-diag] NODE_ENV:", process.env.NODE_ENV);
  console.log("[email-diag] ═══════════════════════════════════════");

  try {
    const response = await resend.emails.send({
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

    // DIAGNOSTIC: Log the FULL Resend response
    console.log("[email-diag] ═══ RESEND RESPONSE ═══");
    console.log("[email-diag] Response type:", typeof response);
    console.log("[email-diag] Response keys:", Object.keys(response));
    console.log("[email-diag] response.data:", JSON.stringify(response.data));
    console.log("[email-diag] response.error:", JSON.stringify(response.error));
    console.log("[email-diag] response.data?.id:", response.data?.id);
    console.log("[email-diag] ═══ END RESEND RESPONSE ═══");

    if (response.error) {
      console.error("[email-diag] ❌ RESEND RETURNED ERROR:", JSON.stringify(response.error));
      return false;
    }

    console.log("[email-diag] ✅ Resend returned success. Email ID:", response.data?.id);
    return true;
  } catch (e) {
    console.error("[email-diag] ❌ EXCEPTION:", e);
    return false;
  }
}
