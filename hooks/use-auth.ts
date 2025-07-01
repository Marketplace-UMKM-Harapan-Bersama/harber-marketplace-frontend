import { useEffect, useState } from "react";
import { getUserData, isAuthenticated, removeToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const authed = isAuthenticated();
    setIsAuthed(authed);

    if (authed) {
      setUser(getUserData());
    } else {
      setUser(null);
    }

    setIsLoading(false);
  };

  const logout = () => {
    removeToken();
    setIsAuthed(false);
    setUser(null);
    router.push("/");
  };

  return {
    isAuthed,
    isLoading,
    user,
    logout,
    checkAuth,
  };
}
