const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;

export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  if (!TURNSTILE_SECRET) return true; // no key configured — skip check

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: TURNSTILE_SECRET,
      response: token,
      remoteip: ip,
    }),
  });

  const data = await res.json();
  return data.success === true;
}
