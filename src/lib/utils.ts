import axios from "axios";

export const cn = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

export const money = (value: number) => `৳${Number(value || 0).toLocaleString("en-US")}`;

export const usd = (value: number) =>
  `$${Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

export const fmtDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

export const initials = (name?: string | null) =>
  (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

// Only allow redirects inside the app
export const safeRedirect = (value: string | null | undefined, fallback = "/dashboard") =>
  value && value.startsWith("/") && !value.startsWith("//") ? value : fallback;

export function errMsg(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    if (message) return message;
    if (error.code === "ERR_NETWORK") return "Cannot reach the server. Please try again.";
    return fallback;
  }
  return error instanceof Error ? error.message : fallback;
}
