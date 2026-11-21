import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const runtime = "nodejs";

const MAX_SIZE = 3 * 1024 * 1024; // 3 MB
const TYPES = ["image/jpeg", "image/png", "image/webp"];

// Uploads an image to ImgBB. The API key stays on the server.
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return Response.json({ message: "Please sign in to upload images." }, { status: 401 });
  }

  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return Response.json({ message: "IMGBB_API_KEY is missing on the server." }, { status: 500 });
  }

  const form = await request.formData();
  const file = form.get("image");

  if (!(file instanceof File)) {
    return Response.json({ message: "No image file was sent." }, { status: 400 });
  }
  if (!TYPES.includes(file.type)) {
    return Response.json({ message: "Only JPG, PNG or WebP images are allowed." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return Response.json({ message: "Image must be smaller than 3 MB." }, { status: 400 });
  }

  const body = new FormData();
  body.append("image", file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body,
  });
  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success) {
    return Response.json(
      { message: data?.error?.message || "ImgBB upload failed." },
      { status: 502 }
    );
  }

  return Response.json({ url: data.data.url as string });
}
