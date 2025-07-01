"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/use-auth";

export const HeroSection = () => {
  const { isAuthed } = useAuth();

  return (
    <div className=" min-h-80 flex items-start text-left md:text-center md:items-center justify-center flex-col gap-6 mb-10">
      <h1 className="text-5xl font-medium">
        Marketplace UMKM <br />
        <span className="text-primary">Harapan Bersama</span>
      </h1>
      <p className="text-md text-foreground max-w-xl">
        Temukan dan dukung produk lokal dari pelaku UMKM di seluruh Indonesia.
        <br className="hidden md:block" />
        Marketplace UMKM Harber adalah platform marketplace untuk menjual,
        membeli, dan tumbuh bersama komunitas usaha kecil menengah.
      </p>

      <div className="flex gap-2 justify-start">
        <Button variant={"default"} asChild>
          <Link href={isAuthed ? "/dashboard" : "/sign-in"}>
            Mulai Jualan
          </Link>
        </Button>

        <Button variant={"outline"} asChild>
          <Link href="/search">Mulai Berbelanja</Link>
        </Button>
      </div>
    </div>
  );
};
