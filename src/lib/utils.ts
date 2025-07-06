import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const isDev = process.env.NODE_ENV === 'development';
export const protocol =
  !isDev ? 'https' : 'http';
export const rootDomain = (!isDev && process.env.NEXT_PUBLIC_ROOT_DOMAIN)?
  process.env.NEXT_PUBLIC_ROOT_DOMAIN  : 'localhost:3000';
export const baseUrl = `${protocol}://${rootDomain}`
  export const getInitials = (str: string): string => {
  if (typeof str !== "string" || !str.trim()) return "?";

  return (
    str
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "?"
  );
};

export function getCookieValue(cookie: string, name: string): string | undefined {
  return cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`))
    ?.split('=')[1];
}
