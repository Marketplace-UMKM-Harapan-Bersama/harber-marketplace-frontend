import { useEffect, useState } from "react";
import { isAuthenticated, removeToken } from "@/lib/auth";
import { authService } from "@/lib/api";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const authed = isAuthenticated();
    setIsAuthed(authed);

    if (authed) {
      try {
        const response = await authService.getUserData();
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }

    setIsLoading(false);
  };

  const logout = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error("Failed to logout:", error);
    } finally {
    removeToken();
    setIsAuthed(false);
    setUser(null);
    router.push("/");
    }
  };

  return {
    isAuthed,
    isLoading,
    user,
    logout,
    checkAuth,
  };
}
