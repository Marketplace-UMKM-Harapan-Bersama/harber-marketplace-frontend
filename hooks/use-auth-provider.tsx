"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { isAuthenticated, removeToken } from "@/lib/auth-client";
import { authService } from "@/lib/api";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types";

interface AuthContextType {
  isAuthed: boolean;
  isLoading: boolean;
  user: User | null;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
};

/**
 * Provider component that wraps your app and makes auth object available to any
 * child component that calls useAuth().
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  /**
   * Check authentication status and fetch user data if authenticated
   */
  const checkAuth = async () => {
    try {
      const authed = isAuthenticated();
      setIsAuthed(authed);

      if (authed) {
        const userData = await authService.getUserData();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Log out the current user
   * Clears auth token, user data, and redirects to home page
   */
  const logout = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error("Failed to logout:", error);
    } finally {
      // Always clear local state even if API call fails
      removeToken();
      setIsAuthed(false);
      setUser(null);
      router.push("/");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    isAuthed,
    isLoading,
    user,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook for managing authentication state
 * Provides authentication status, user data, and auth-related functions
 *
 * @returns {AuthContextType} Authentication state and functions
 * @property {boolean} isAuthed - Whether the user is currently authenticated
 * @property {boolean} isLoading - Whether the auth state is being checked
 * @property {User | null} user - Current user data if authenticated
 * @property {() => Promise<void>} logout - Function to log out the user
 * @property {() => Promise<void>} checkAuth - Function to manually check auth status
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
