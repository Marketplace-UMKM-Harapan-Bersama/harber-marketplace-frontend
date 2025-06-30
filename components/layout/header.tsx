"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import { Input } from "../ui/input";
import { UserButton } from "../auth/user-button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CartSheet } from "../cart-sheet";

export const Header = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between px-10 py-4  bg-background">
        <div className="flex items-center gap-8 w-full max-w-7xl mx-auto">
          <Link href={"/"} className="text-2xl font-black shrink-0">
            H
          </Link>
          <nav className="flex items-center gap-4 flex-1">
            <form onSubmit={handleSearch} className="relative flex-1 w-full">
              <Input
                placeholder="Cari produk"
                className="flex-1 w-full rounded-r-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                className="absolute right-0 top-0 rounded-r-full"
              >
                <Search className="w-4 h-4 text-white" />
              </Button>
            </form>
            <div className="flex items-center gap-4 shrink-0">
              <CartSheet />
              <UserButton />
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};
