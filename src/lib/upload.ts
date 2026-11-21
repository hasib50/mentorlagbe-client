// Sends an image to our own /api/upload route (which forwards it to ImgBB)
export async function uploadImage(file: File): Promise<string> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Please choose a JPG, PNG or WebP image.");
  }
  if (file.size > 3 * 1024 * 1024) {
    throw new Error("Image must be smaller than 3 MB.");
  }

  const body = new FormData();
  body.append("image", file);

  const response = await fetch("/api/upload", { method: "POST", body });
  const data = (await response.json().catch(() => ({}))) as {
    url?: string;
    message?: string;
  };

  if (!response.ok || !data.url) {
    throw new Error(data.message || "Image upload failed. Please try again.");
  }
  return data.url;
}
