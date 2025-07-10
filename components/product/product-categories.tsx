"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useCategories } from "@/hooks/use-queries";
import { Skeleton } from "../ui/skeleton";
import { SearchIcon } from "lucide-react";
import { Category } from "@/lib/types";

export const ProductCategories = () => {
  const { data: categories, error, isLoading } = useCategories();

  if (error) {
    return (
      <div className="text-center text-red-500 py-2">
        Failed to load categories
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
      <Link href="/search">
        <Button
          variant="default"
          className="whitespace-nowrap flex items-center gap-2"
        >
          <span className="text-sm">Semua Produk</span>
          <SearchIcon className="w-4 h-4" />
        </Button>
      </Link>
      {isLoading &&
        Array.from({ length: 7 }).map((_, idx) => (
          <Skeleton key={idx} className="w-24 h-9" />
        ))}
      {!isLoading &&
        categories?.map((category: Category) => (
          <Link href={`/search/${category.slug}`} key={category.id}>
            <Button variant="outline" className="whitespace-nowrap">
              <span className="text-sm">{category.name}</span>
            </Button>
          </Link>
        ))}
    </div>
  );
};
