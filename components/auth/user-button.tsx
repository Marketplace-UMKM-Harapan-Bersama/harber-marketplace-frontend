"use client";
import { Button } from "@/components/ui/button";
import { Loader, LogOut, Package, User } from "lucide-react";
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

export function UserButton() {
  const { isAuthed, logout, isLoading, user } = useAuth();
  const { setTheme, theme } = useTheme();

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" disabled>
          <Loader className="h-5 w-5 animate-spin" />
        </Button>
      </div>
    );
  }

  // Show login/register buttons if not authenticated
  if (!isAuthed) {
    return (
      <div className="flex items-center gap-2">
        <Button variant={"default"} asChild>
          <Link href={"/sign-in"}>Masuk</Link>
        </Button>
        <Button asChild>
          <Link href={"/sign-up"}>Daftar</Link>
        </Button>
      </div>
    );
  }

  // Show user menu if authenticated
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"noShadow"} className="w-10 h-10 p-0">
          <User className="w-5 h-5 text-primary-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 text-xs p-1">
        <DropdownMenuLabel className="flex items-center gap-2 max-w-[180px] truncate">
          <User className="w-4 h-4" />
          <span className="truncate">
            {user?.email || "nungggu,api/users@gmail.com"}
          </span>
          {/* <span className="truncate">nungggu,api/users@gmail.com</span> */}
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
          <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
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
  );
}
