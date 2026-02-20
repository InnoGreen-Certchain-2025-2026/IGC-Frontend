import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts initials from a user's display name to use as an avatar fallback.
 * Takes the first letter of the first and last words in the name.
 * @example getAvatarFallback("Nguyen Van A") => "NA"
 * @example getAvatarFallback("Admin") => "A"
 */
export function getAvatarFallback(name?: string | null): string {
  if (!name || !name.trim()) return "?";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

/**
 * Ensures the given path is a full S3 URL.
 * If the path already starts with http/https or the S3 URL, it returns it as is.
 * Otherwise, it prepends the configured VITE_S3_URL.
 */
export function getS3Url(path?: string | null): string {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("https")) {
    return path;
  }
  const s3Url = import.meta.env.VITE_S3_URL;
  if (!s3Url) return path;

  // Handle potential double slashes if path starts with /
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  const cleanS3Url = s3Url.endsWith("/") ? s3Url : `${s3Url}/`;

  return `${cleanS3Url}${cleanPath}`;
}
