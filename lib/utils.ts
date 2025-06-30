import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { redirect } from "next/navigation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Check if we're on the client side
const isClient = typeof window !== "undefined";

export function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function getToken() {
  if (!isClient) return null;
  return localStorage.getItem("access_token");
}

export function setToken(token: string) {
  if (!isClient) return;
  localStorage.setItem("access_token", token);
}

export function removeToken() {
  if (!isClient) return;
  localStorage.removeItem("access_token");
}

export function isAuthenticated() {
  return !!getToken();
}

// Redirect authenticated users away from auth pages (login/register)
export function redirectIfAuthenticated() {
  if (isAuthenticated()) {
    redirect("/");
  }
}

// Protect routes that require authentication
export function requireAuth() {
  if (!isAuthenticated()) {
    redirect("/sign-in");
  }
}
