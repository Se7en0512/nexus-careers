import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const ip = getClientIp(req);
  if (!(await rateLimit(`avatar:${ip}`, 5, 10 * 60 * 1000))) {
    return NextResponse.json({ error: "Too many uploads — please wait 10 minutes." }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json({ error: "Only JPG, PNG, or WebP images are allowed" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Image must be under 5MB" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "thrive/avatars",
          public_id: `user-${user.id}`,
          overwrite: true,
          transformation: [
            { width: 400, height: 400, crop: "fill", gravity: "face", quality: "auto", fetch_format: "auto" },
          ],
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error || new Error("Upload failed"));
          } else {
            resolve(uploadResult);
          }
        }
      );
      stream.end(buffer);
    });

    await db
      .prepare("UPDATE portfolios SET avatar_url = ? WHERE user_id = ?")
      .run(result.secure_url, user.id);

    return NextResponse.json({ ok: true, url: result.secure_url });
  } catch {
    return NextResponse.json({ error: "Upload failed — please try again" }, { status: 500 });
  }
}
