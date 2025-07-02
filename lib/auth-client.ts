import Cookies from "js-cookie";

/**
 * Name of the cookie used to store the authentication token
 */
export const COOKIE_NAME = "access_token";

/**
 * Cookie configuration options
 * @property {number} expires - Number of days until the cookie expires
 * @property {string} sameSite - CSRF protection setting
 * @property {boolean} secure - Only transmit cookie over HTTPS
 */
export const COOKIE_OPTIONS = {
  expires: 7,
  sameSite: "strict" as const,
  secure: true,
};

/**
 * Get the authentication token from cookie
 * @returns {string | null} The authentication token if present, null otherwise
 */
export function getToken(): string | null {
  try {
    return Cookies.get(COOKIE_NAME) || null;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
}

/**
 * Set the authentication token in cookie
 * @param {string} token - The JWT token to store
 * @throws {Error} If token is invalid or empty
 */
export function setToken(token: string): void {
  if (!token) {
    throw new Error("Token cannot be empty");
  }

  try {
    Cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
  } catch (error) {
    console.error("Error setting token:", error);
    throw new Error("Failed to set authentication token");
  }
}

/**
 * Remove the authentication token from cookie
 */
export function removeToken(): void {
  try {
    Cookies.remove(COOKIE_NAME);
  } catch (error) {
    console.error("Error removing token:", error);
  }
}

/**
 * Check if the user is authenticated by validating the JWT token
 * @returns {boolean} True if user is authenticated, false otherwise
 */
export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds

    if (Date.now() >= expirationTime) {
      removeToken();
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error validating token:", error);
    removeToken();
    return false;
  }
}
