"use client";

import { useState, memo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ProductList } from "./product-list";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories, useProductsByCategory } from "@/hooks/use-queries";
import { slugify } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/lib/types";
import Image from "next/image";
import { formatPrice, getProductImageUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ProductCardSkeleton } from "./product-card-skeleton";
import { usePaginatedProductCategories } from "@/hooks/use-queries";

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

// Memoized Category Sidebar Component
const CategorySidebar = memo(function CategorySidebar({
  currentCategory,
  isLoading,
}: {
  currentCategory: string | undefined;
  isLoading: boolean;
}) {
  const [page, setPage] = useState(1);
  const { data: response, isLoading: isCategoriesLoading } =
    usePaginatedProductCategories(page);
  const categories = response?.data;
  const meta = response?.meta;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (meta?.last_page || 1)) {
      setPage(newPage);
    }
  };

  if (isLoading || isCategoriesLoading) {
    return (
      <div className="hidden md:flex flex-col items-start gap-2 w-48">
        <Skeleton className="h-8 w-32 mb-2" />
        <div className="space-y-2 w-full">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
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

      {categories?.map((category) => (
        <Link
          key={`desktop-cat-${category.id}-${slugify(category.name)}`}
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

      {meta && meta.last_page > 1 && (
        <div className="w-full pt-4 flex justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === meta.last_page}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
});

// Memoized Sort Sidebar Component
const SortSidebar = memo(function SortSidebar({
  currentSort,
  onSortChange,
}: {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}) {
  return (
    <div className="hidden md:flex flex-col items-start gap-2 w-48">
      <h3 className="font-medium text-lg mb-2">Sort by</h3>
      {sortOptions.map((option, index) => (
        <button
          key={`desktop-sort-${option.value}-${index}`}
          onClick={() => onSortChange(option.value)}
          className={`text-left w-full px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors ${
            currentSort === option.value
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
});

// Memoized Mobile Controls Component
const MobileControls = memo(function MobileControls({
  categories,
  currentCategory,
  currentSort,
  onSortChange,
}: {
  categories: Category[] | undefined;
  currentCategory: string | undefined;
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}) {
  return (
    <div className="md:hidden space-y-4 mb-6">
      {/* Mobile Categories */}
      <Select
        value={currentCategory}
        onValueChange={(value) => (window.location.href = `/search/${value}`)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Products</SelectItem>
          {categories?.map((category, index) => (
            <SelectItem
              key={`mobile-cat-${category.id}-${index}-${slugify(
                category.name
              )}`}
              value={slugify(category.name)}
            >
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Mobile Sort */}
      <Select value={currentSort} onValueChange={onSortChange}>
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
    </div>
  );
});

interface ProductListWithSortProps {
  searchQuery?: string;
  categoryId?: number;
  categorySlug?: string;
  className?: string;
  gridCols?: "grid-4" | "grid-6" | "scroll";
  itemsPerPage?: number;
}

export function ProductListWithSort({
  searchQuery,
  categoryId,
  categorySlug,
  className,
  gridCols = "grid-6",
  itemsPerPage = 12,
}: ProductListWithSortProps) {
  const [sort, setSort] = useState<SortOption>("relevance");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pathname = usePathname();
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();

  // Use category-specific endpoint when categorySlug is provided
  const { data: categoryData, isLoading: isCategoryLoading } =
    useProductsByCategory(categorySlug || "");

  const handlePageChange = (current: number, pages: number) => {
    setPage(current);
    setTotalPages(pages);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaginationClick = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const currentCategory = pathname.split("/").pop();

  // Apply sorting to category products
  const sortedProducts = categoryData?.products
    ? [...categoryData.products].sort((a, b) => {
        switch (sort) {
          case "price_asc":
            return parseFloat(a.price) - parseFloat(b.price);
          case "price_desc":
            return parseFloat(b.price) - parseFloat(a.price);
          case "latest":
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          default:
            return 0;
        }
      })
    : [];

  const gridStyles = {
    "grid-4":
      "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
    "grid-6":
      "grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  gap-6",
    scroll:
      "flex gap-4 snap-x snap-mandatory overflow-x-auto pb-4 no-scrollbar",
  };

  // Loading skeleton
  if (isCategoriesLoading || (categorySlug && isCategoryLoading)) {
    return (
      <div className="relative">
        <div className="flex gap-8">
          <CategorySidebar
            currentCategory={currentCategory}
            isLoading={isCategoriesLoading}
          />

          {/* Main Content Loading */}
          <div className="flex-1">
            {categorySlug && <Skeleton className="h-12 w-64 mb-6" />}
            <div className={cn(gridStyles[gridCols], className)}>
              {Array.from({ length: itemsPerPage || 8 }).map((_, index) => (
                <ProductCardSkeleton
                  key={index}
                  isScrollable={gridCols === "scroll"}
                />
              ))}
            </div>
          </div>

          <SortSidebar currentSort={sort} onSortChange={setSort} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <MobileControls
        categories={categories}
        currentCategory={currentCategory}
        currentSort={sort}
        onSortChange={setSort}
      />

      {/* Desktop Layout */}
      <div className="flex gap-8">
        <CategorySidebar
          currentCategory={currentCategory}
          isLoading={isCategoriesLoading}
        />

        {/* Main Content */}
        <div className="flex-1">
          {categoryData && (
            <h1 className="text-3xl font-bold mb-6">{categoryData.name}</h1>
          )}

          {/* Show either category products or search results */}
          {categorySlug ? (
            <div className={cn(gridStyles[gridCols], className)}>
              {sortedProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className={cn(
                    "block",
                    gridCols === "scroll" &&
                      "snap-start min-w-[280px] first:ml-0"
                  )}
                >
                  <div className="rounded-lg group h-full overflow-hidden border-none shadow-none transition-shadow duration-300">
                    <div className="rounded-lg relative aspect-square overflow-hidden bg-muted border group-hover:border-primary">
                      <Image
                        src={getProductImageUrl(
                          product.image_url,
                          product.seller
                        )}
                        alt={product.name}
                        fill
                        onError={(e) => {
                          e.currentTarget.srcset = "";
                          e.currentTarget.src = "/default-image.png";
                        }}
                        placeholder="empty"
                        className="object-cover transition-transform duration-300 group-hover:scale-105 fade-in-0"
                      />
                    </div>
                    <div className="flex flex-col gap-1 pt-2">
                      <h2 className="line-clamp-1 text-base">{product.name}</h2>
                      {product.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                          {product.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-md font-medium">
                          {formatPrice(parseFloat(product.price))}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <ProductList
              searchQuery={searchQuery}
              categoryId={categoryId}
              sortBy={sort}
              page={page}
              onPageChange={handlePageChange}
              className={className}
              gridCols={gridCols}
              itemsPerPage={itemsPerPage}
              isPaginated={true}
            />
          )}

          {/* Only show pagination for non-category views */}
          {!categorySlug && totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePaginationClick(page - 1);
                    }}
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {page > 2 && (
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePaginationClick(1);
                      }}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                )}

                {page > 3 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {page > 1 && (
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePaginationClick(page - 1);
                      }}
                    >
                      {page - 1}
                    </PaginationLink>
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    {page}
                  </PaginationLink>
                </PaginationItem>

                {page < totalPages && (
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePaginationClick(page + 1);
                      }}
                    >
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>
                )}

                {page < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {page < totalPages - 1 && (
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePaginationClick(totalPages);
                      }}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePaginationClick(page + 1);
                    }}
                    className={
                      page === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>

        <SortSidebar currentSort={sort} onSortChange={setSort} />
      </div>
    </div>
  );
}
