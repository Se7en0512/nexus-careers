const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET_KEY;

export async function verifyCaptcha(token: string, ip: string): Promise<boolean> {
  if (!HCAPTCHA_SECRET) return true; // no key configured — skip check

  const res = await fetch("https://api.hcaptcha.com/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: HCAPTCHA_SECRET,
      response: token,
      remoteip: ip,
    }),
  });

  const data = await res.json();
  return data.success === true;
}
