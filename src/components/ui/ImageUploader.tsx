"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { ImagePlus, Loader2 } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import Avatar from "@/components/ui/Avatar";
import { uploadImage } from "@/lib/upload";

type Props = {
  value: string;
  onChange: (url: string) => void;
  variant?: "banner" | "avatar";
  name?: string;
  error?: string;
};

// Direct file upload (ImgBB through our /api/upload route)
export default function ImageUploader({ value, onChange, variant = "banner", name, error }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function onFile(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
      toast.success("Image uploaded!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const button = (
    <button
      type="button"
      className="btn btn-outline btn-sm"
      onClick={() => inputRef.current?.click()}
      disabled={uploading}
    >
      {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
      {uploading ? "Uploading..." : value ? "Change image" : "Upload image"}
    </button>
  );

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => onFile(event.target.files?.[0])}
      />

      {variant === "avatar" ? (
        <div className="flex items-center gap-4">
          <Avatar src={value} name={name} className="size-20 text-2xl" />
          <div>
            {button}
            <p className="mt-2 text-xs text-base-content/60">JPG, PNG or WebP, up to 3 MB.</p>
          </div>
        </div>
      ) : (
        <div className={`rounded-2xl border border-dashed p-3 ${error ? "border-error" : "border-base-300"}`}>
          {value ? (
            <SafeImage src={value} alt="Banner preview" className="aspect-[16/8] w-full rounded-xl object-cover" />
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="grid aspect-[16/8] w-full place-items-center rounded-xl bg-base-200 text-base-content/60"
            >
              <span className="flex flex-col items-center gap-2 text-sm font-semibold">
                <ImagePlus size={30} /> Click to upload a banner image
              </span>
            </button>
          )}
          <div className="mt-3 flex items-center justify-between gap-3">
            {button}
            <span className="text-xs text-base-content/60">JPG, PNG or WebP, up to 3 MB</span>
          </div>
        </div>
      )}
    </div>
  );
}
