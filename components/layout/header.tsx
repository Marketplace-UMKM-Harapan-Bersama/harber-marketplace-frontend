"use client";

import { Button } from "@/components/ui/button";
import { Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Input } from "../ui/input";
import { UserButton } from "../auth/user-button";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-10 py-4 border-b bg-background">
      <div className="flex items-center gap-8 w-full max-w-7xl mx-auto">
        <Link href={"/"} className="text-2xl font-black shrink-0">
          H
        </Link>
        <nav className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 w-full">
            <Input
              placeholder="Cari produk"
              className="flex-1 w-full rounded-r-full"
            />
            <Button className="absolute right-0 top-0 rounded-r-full">
              <Search className="w-4 h-4 text-white" />
            </Button>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <Button
              className="rounded-full relative"
              variant={"default"}
              size={"icon"}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>

            <UserButton />
          </div>
        </nav>
      </div>
    </header>
  );
};
