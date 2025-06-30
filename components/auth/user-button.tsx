"use client";

import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated, removeToken } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UserButton = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <div className="flex items-center gap-2">
      {!isLoggedIn ? (
        <>
          <Button className="rounded-full" variant={"outline"} asChild>
            <Link href={"/sign-in"}>Masuk</Link>
          </Button>
          <Button className="rounded-full" asChild>
            <Link href={"/sign-up"}>Daftar</Link>
          </Button>
        </>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="rounded-full w-10 h-10 p-0 bg-gradient-to-br from-primary to-primary/50 hover:from-primary/80 hover:to-primary"
              variant="ghost"
            >
              <User className="w-5 h-5 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">Profil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/orders">Pesanan</Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem asChild>
              <Link href="/wishlist">Wishlist</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator /> */}
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={handleLogout}
            >
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
