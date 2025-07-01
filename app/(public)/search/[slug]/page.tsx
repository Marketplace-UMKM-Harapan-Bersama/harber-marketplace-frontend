"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { useCategories } from "@/hooks/use-queries";
import { ProductListWithSort } from "@/components/product/product-list-with-sort";
import { slugify } from "@/lib/utils";

interface CategorySearchPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CategorySearchPage({
  params,
}: CategorySearchPageProps) {
  const { slug } = use(params);
  const { data: categories } = useCategories();
  const [categoryId, setCategoryId] = useState<number>();

  useEffect(() => {
    if (categories && slug) {
      const category = categories.find((cat) => slugify(cat.name) === slug);
      if (category) {
        setCategoryId(category.id);
      }
    }
  }, [categories, slug]);

  return (
    <div className="container py-6">
      <ProductListWithSort categoryId={categoryId} gridCols="grid-4" />
    </div>
  );
}
