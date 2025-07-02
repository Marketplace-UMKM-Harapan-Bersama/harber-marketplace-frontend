"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME } from "./auth-client";

/**
 * Get the authentication token from cookie on the server side
 * @returns {Promise<string | null>} The authentication token if present, null otherwise
 */
export async function getServerToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAME)?.value || null;
  } catch (error) {
    console.error("Error getting server token:", error);
    return null;
  }
}

/**
 * Check if the user is authenticated on the server side
 * Validates the JWT token and checks its expiration
 * @returns {Promise<boolean>} True if user is authenticated, false otherwise
 */
export async function isServerAuthenticated(): Promise<boolean> {
  const token = await getServerToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds

    return Date.now() < expirationTime;
  } catch (error) {
    console.error("Error validating server token:", error);
    return false;
  }
}

/**
 * Protect routes that require authentication
 * Redirects to sign-in page if user is not authenticated
 * @throws {RedirectError} Redirects to /sign-in if not authenticated
 */
export async function requireAuth(): Promise<void> {
  try {
    if (!(await isServerAuthenticated())) {
      redirect("/sign-in");
    }
  } catch (error) {
    console.error("Error in requireAuth:", error);
    redirect("/sign-in");
  }
}

/**
 * Redirect authenticated users away from auth pages
 * Used to prevent authenticated users from accessing sign-in/sign-up pages
 * @throws {RedirectError} Redirects to / if authenticated
 */
export async function redirectIfAuthenticated(): Promise<void> {
  try {
    if (await isServerAuthenticated()) {
      redirect("/");
    }
  } catch (error) {
    console.error("Error in redirectIfAuthenticated:", error);
    // On error, we don't redirect to be safe
  }
}
