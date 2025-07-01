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
    <div className="container py-6 space-y-6">
      <ProductListWithSort searchQuery={searchQuery} gridCols="grid-4" />
    </div>
  );
}
