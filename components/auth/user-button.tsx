"use client";

import { Button } from "@/components/ui/button";
import { LogOut, Package, User } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/use-auth";

export const UserButton = () => {
  const { isAuthed, logout } = useAuth();
  // const { isAuthed, logout, user } = useAuth();
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      {!isAuthed ? (
        <>
          <Button variant={"default"} asChild>
            <Link href={"/sign-in"}>Masuk</Link>
          </Button>
          <Button asChild>
            <Link href={"/sign-up"}>Daftar</Link>
          </Button>
        </>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"noShadow"} className=" w-10 h-10 p-0 ">
              <User className="w-5 h-5 text-primary-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 text-xs p-1">
            <DropdownMenuLabel className="flex items-center gap-2 max-w-[180px] truncate">
              <User className="w-4 h-4" />
              <span className="truncate">wahyufadil1140@gmail.com</span>
            </DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/orders" className="flex items-center gap-2">
                <Package />
                Pesanan Saya
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
              <DropdownMenuRadioItem value="system">
                System
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="w-4 h-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
