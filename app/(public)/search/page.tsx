"use client";

import { use } from "react";
import { ProductListWithSort } from "@/components/product/product-list-with-sort";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const { q: searchQuery } = use(searchParams);

  return (
    <div className="py-6">
      {searchQuery ? (
        <>
          <h1 className="text-3xl font-bold mb-6">
            Search Results for &quot;{searchQuery}&quot;
          </h1>
          <ProductListWithSort />
        </>
      ) : (
        <ProductListWithSort />
      )}
    </div>
  );
}
