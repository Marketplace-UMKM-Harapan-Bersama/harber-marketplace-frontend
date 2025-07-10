import { useCallback, useEffect, useState } from "react";
import { authService } from "@/lib/api";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { User } from "@/lib/types";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Check if user is authenticated
  const checkAuth = useCallback(async () => {
    try {
      const token = Cookies.get("access_token");
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const response = await authService.getUserData();
      if (response) {
        setUser(response);
      }
    } catch (error) {
      setUser(null);
      Cookies.remove("access_token");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      Cookies.remove("access_token");
      setUser(null);
      router.push("/sign-in");
    }
  }, [router]);

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isAuthed: !!user,
    isLoading,
    logout,
    checkAuth,
  };
}
