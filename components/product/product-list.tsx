"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice, slugify } from "@/lib/utils";
import { useProducts } from "@/hooks/use-queries";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { ProductCardSkeleton } from "./product-card-skeleton";

interface ProductListProps {
  excludeProduct?: number;
  className?: string;
  sellerId?: number;
  searchQuery?: string;
  sortBy?: "relevance" | "trending" | "latest" | "price_asc" | "price_desc";
  page?: number;
  onPageChange?: (totalPages: number) => void;
  itemsPerPage?: number;
  gridCols?: "grid-4" | "grid-6" | "scroll";
  isPaginated?: boolean;
}

export function ProductList({
  excludeProduct,
  className = "",
  sellerId,
  searchQuery,
  sortBy = "relevance",
  page = 1,
  onPageChange,
  itemsPerPage = 10,
  gridCols = "grid-6",
  isPaginated = true,
}: ProductListProps) {
  const {
    data: products,
    isLoading,
    error,
  } = useProducts({
    sellerId,
    excludeProduct,
    searchQuery,
    sortBy,
    page,
  });

  // Update total pages when products change
  useEffect(() => {
    if (isPaginated && onPageChange && products) {
      const totalPages = Math.ceil(products.length / itemsPerPage);
      onPageChange(totalPages);
    }
  }, [products, onPageChange, itemsPerPage, isPaginated]);

  const gridStyles = {
    "grid-4":
      "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
    "grid-6":
      "grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6",
    scroll: "flex gap-4 snap-x snap-mandatory overflow-x-auto pb-4",
  };

  if (isLoading) {
    return (
      <div className={cn(gridStyles[gridCols], className)}>
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <ProductCardSkeleton
            key={index}
            isScrollable={gridCols === "scroll"}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Failed to load products
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No products found
      </div>
    );
  }

  // Get displayed products based on pagination settings
  const displayedProducts = isPaginated
    ? products.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    : products;

  return (
    <div className={cn(gridStyles[gridCols], className)}>
      {displayedProducts.map((product) => (
        <Link
          key={product.id}
          href={`/products/${slugify(product.name)}`}
          className={cn(
            "block",
            gridCols === "scroll" && "snap-start min-w-[280px] first:ml-0"
          )}
        >
          <div className="rounded-lg group h-full overflow-hidden border-none shadow-none transition-shadow duration-300">
            <div className="rounded-lg relative aspect-square overflow-hidden bg-muted">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
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
                <span className="text-lg font-bold">
                  {formatPrice(product.price)}
                </span>
                {product.stock !== undefined && (
                  <span className="text-sm text-muted-foreground">
                    Stok: {product.stock}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
