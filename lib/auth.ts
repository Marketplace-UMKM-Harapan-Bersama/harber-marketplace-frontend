import { redirect } from "next/navigation";

// Check if we're on the client side
const isClient = typeof window !== "undefined";

/**
 * Get the authentication token from localStorage
 * @returns string | null
 */
export function getToken(): string | null {
  if (!isClient) return null;
  return localStorage.getItem("access_token");
}

/**
 * Set the authentication token in localStorage
 * @param token - The JWT token to store
 */
export function setToken(token: string): void {
  if (!isClient) return;
  localStorage.setItem("access_token", token);
}

/**
 * Remove the authentication token from localStorage
 */
export function removeToken(): void {
  if (!isClient) return;
  localStorage.removeItem("access_token");
}

/**
 * Check if the user is authenticated
 * @returns boolean
 */
export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;

  try {
    // Basic JWT expiration check
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds

    if (Date.now() >= expirationTime) {
      removeToken();
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
    removeToken();
    return false;
  }
}

/**
 * Protect routes that require authentication
 * Redirects to sign-in if not authenticated
 */
export function requireAuth(): void {
  if (!isAuthenticated()) {
    redirect("/sign-in");
  }
}

/**
 * Redirect authenticated users away from auth pages
 * Redirects to home if already authenticated
 */
export function redirectIfAuthenticated(): void {
  if (isAuthenticated()) {
    redirect("/");
  }
}

// /**
//  * Get user data from JWT token
//  * @returns any - The decoded token payload or null if not authenticated
//  */
// export function getUserData(): any | null {
//   const token = getToken();
//   if (!token) return null;

//   try {
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     return payload;
//   } catch (error) {
//     return null;
//   }
// }
