"use client";

import { use } from "react";
import { ProductListWithSort } from "@/components/product/product-list-with-sort";
import { Suspense } from "react";

interface SearchPageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ q?: string }>;
}

export default function SearchPage({ params, searchParams }: SearchPageProps) {
  const { slug } = use(params);
  const { q } = use(searchParams);

  const categorySlug = slug?.[0];
  const searchQuery = q;

  return (
    <div className="container py-8 px-10">
      <h1 className="text-2xl font-bold mb-6">
        {categorySlug
          ? `Category: ${categorySlug}`
          : searchQuery
          ? `Search results for "${searchQuery}"`
          : "All Products"}
      </h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductListWithSort searchQuery={searchQuery} />
      </Suspense>
    </div>
  );
}
