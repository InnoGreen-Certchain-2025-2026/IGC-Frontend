import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
