"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import { Input } from "../ui/input";
import { UserButton } from "../auth/user-button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CartSheet } from "../cart-sheet";
import { Banner } from "./banner";

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
      <Banner
        message="Temukan produk terbaik untuk kebutuhan Anda dengan harga terjangkau."
        backgroundColor="bg-primary"
        textColor="text-primary-foreground"
        link="/search"
        close={false}
      />
      <header className="sticky top-0 z-50 w-full bg-background container mx-auto">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between w-full gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <Button
                  variant="noShadow"
                  className="flex items-center  text-primary-foreground font-black text-2xl px-3 py-2 "
                >
                  H
                </Button>

                <p className="hidden md:block text-primary font-bold "></p>
              </Link>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md sm:max-w-lg md:max-w-xl">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  placeholder="Cari produk"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 bg-background"
                />
                <Button
                  type="submit"
                  className="absolute right-0 top-0 h-full"
                  variant="ghost"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </form>
            </div>

            {/* Actions */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <CartSheet />
              <UserButton />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
