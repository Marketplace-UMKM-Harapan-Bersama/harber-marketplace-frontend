"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductList } from "./product-list";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts, useCategories } from "@/hooks/use-queries";
import { slugify } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SortOption =
  | "relevance"
  | "trending"
  | "latest"
  | "price_desc"
  | "price_asc";

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "trending", label: "Trending" },
  { value: "latest", label: "Latest arrivals" },
  { value: "price_desc", label: "Price: High to low" },
  { value: "price_asc", label: "Price: Low to high" },
] as const;

interface ProductListWithSortProps {
  searchQuery?: string;
  categoryId?: number;
  className?: string;
  gridCols?: "grid-4" | "grid-6";
  itemsPerPage?: number;
}

export function ProductListWithSort({
  searchQuery,
  categoryId,
  className,
  gridCols = "grid-6",
  itemsPerPage = 12,
}: ProductListWithSortProps) {
  const [sort, setSort] = useState<SortOption>("relevance");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pathname = usePathname();
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();

  const { isLoading } = useProducts({
    searchQuery,
    categoryId,
    sortBy: sort,
    page,
  });

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const currentCategory = pathname.split("/").pop();

  return (
    <div className="relative">
      {/* Mobile Controls */}
      <div className="md:hidden space-y-4 mb-6">
        {/* Mobile Categories */}
        {isCategoriesLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select
            value={currentCategory}
            onValueChange={(value) =>
              (window.location.href = `/search/${value}`)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              {categories?.map((category, index) => (
                <SelectItem
                  key={`mobile-cat-${category.id}-${index}-${slugify(
                    category.name,
                  )}`}
                  value={slugify(category.name)}
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Mobile Sort */}
        {isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select
            value={sort}
            onValueChange={(value: SortOption) => setSort(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option, index) => (
                <SelectItem
                  key={`mobile-sort-${option.value}-${index}`}
                  value={option.value}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="flex gap-8">
        {/* Categories Filter (Left Sidebar) */}
        <div className="hidden md:flex flex-col items-start gap-2 w-48">
          <h3 className="font-medium text-lg mb-2">Kategori</h3>
          <Link href="/search" className="w-full">
            <button
              className={`text-left w-full px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors ${
                !currentCategory || currentCategory === "search"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              }`}
            >
              All Products
            </button>
          </Link>
          {isCategoriesLoading && (
            <div className="flex flex-col gap-4 px-3 py-2">
              {Array.from({ length: 7 }).map((_, idx) => (
                <Skeleton key={idx} className="w-40 h-9 rounded-md" />
              ))}
            </div>
          )}

          {categories?.map((category, index) => (
            <Link
              key={`desktop-cat-${category.id}-${index}-${slugify(
                category.name,
              )}`}
              href={`/search/${slugify(category.name)}`}
              className="w-full"
            >
              <button
                className={`text-left w-full px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors ${
                  currentCategory === slugify(category.name)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {category.name}
              </button>
            </Link>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <ProductList
            searchQuery={searchQuery}
            categoryId={categoryId}
            sortBy={sort}
            page={page}
            onPageChange={setTotalPages}
            className={className}
            gridCols={gridCols}
            itemsPerPage={itemsPerPage}
            isPaginated={true}
          />

          {totalPages > 1 && !isLoading && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <Button
                      key={`pagination-${pageNum}`}
                      variant={pageNum === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  ),
                )}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Sort Options (Right Sidebar) */}
        <div className="hidden md:flex flex-col items-start gap-2 w-48">
          <h3 className="font-medium text-lg mb-2">Sort by</h3>
          {sortOptions.map((option, index) => (
            <button
              key={`desktop-sort-${option.value}-${index}`}
              onClick={() => setSort(option.value)}
              className={`text-left w-full px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors ${
                sort === option.value
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
