"use client";

import { use } from "react";
import { ProductListWithSort } from "@/components/product/product-list-with-sort";

interface CategorySearchPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CategorySearchPage({
  params,
}: CategorySearchPageProps) {
  const { slug } = use(params);

  return (
    <div className="container py-6">
      <ProductListWithSort categorySlug={slug} />
    </div>
  );
}
