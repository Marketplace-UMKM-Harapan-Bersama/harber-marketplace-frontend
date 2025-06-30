"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useCategories } from "@/hooks/use-queries";

export const ProductCategories = () => {
  const { data: categories, error, isLoading } = useCategories();

  if (error) {
    return (
      <div className="text-center text-red-500 py-2">
        Failed to load categories
      </div>
    );
  }

  const displayCategories = categories;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {isLoading && <div>Loading...</div>}
      {!isLoading &&
        displayCategories?.map((category) => (
          <Link
            href={`/search/${category.slug || category.id}`}
            key={category.id}
          >
            <Button
              variant="outline"
              className={`rounded-full whitespace-nowrap`}
            >
              <span className="text-sm">{category.name}</span>
            </Button>
          </Link>
        ))}
    </div>
  );
};
