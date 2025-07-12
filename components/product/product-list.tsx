"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useProducts } from "@/hooks/use-queries";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { ProductCardSkeleton } from "./product-card-skeleton";

interface ProductListProps {
  excludeProduct?: number;
  className?: string;
  sellerId?: number;
  searchQuery?: string;
  categoryId?: number;
  sortBy?: "relevance" | "trending" | "latest" | "price_asc" | "price_desc";
  page?: number;
  onPageChange?: (
    currentPage: number,
    totalPages: number,
    total: number,
  ) => void;
  itemsPerPage?: number;
  gridCols?: "grid-4" | "grid-6" | "scroll";
  isPaginated?: boolean;
}

export function ProductList({
  excludeProduct,
  className = "",
  sellerId,
  searchQuery,
  categoryId,
  sortBy = "relevance",
  page = 1,
  onPageChange,
  itemsPerPage = 15,
  gridCols = "grid-6",
  isPaginated = true,
}: ProductListProps) {
  const {
    data: response,
    isLoading,
    error,
  } = useProducts({
    sellerId,
    excludeProduct,
    searchQuery,
    categoryId,
    sortBy,
    page,
  });

  // Update pagination info when data changes
  useEffect(() => {
    if (isPaginated && onPageChange && response?.meta) {
      onPageChange(
        response.meta.current_page,
        response.meta.last_page,
        response.meta.total,
      );
    }
  }, [response, onPageChange, isPaginated]);

  const gridStyles = {
    "grid-4":
      "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
    "grid-6":
      "grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6",
    scroll:
      "flex gap-4 snap-x snap-mandatory overflow-x-auto pb-4 no-scrollbar",
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

  if (!response?.data || response.data.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No products found
      </div>
    );
  }

  const products = response.data;

  return (
    <div className={cn(gridStyles[gridCols], className)}>
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.slug}`}
          className={cn(
            "block",
            gridCols === "scroll" && "snap-start min-w-[280px] first:ml-0",
          )}
        >
          <div className="rounded-t-lg  group h-full overflow-hidden border-none shadow-none transition-shadow duration-300">
            <div className=" rounded-lg relative aspect-square overflow-hidden bg-muted border group-hover:border-primary">
              <Image
                src={product.image_url || "/default-image.png"}
                alt={product.name}
                fill
                onError={(e) => {
                  e.currentTarget.srcset = "";
                  e.currentTarget.src = "/default-image.png";
                }}
                placeholder="empty"
                className="object-cover h-full transition-transform duration-300 group-hover:scale-105 fade-in-0 "
              />
            </div>
            <div className="flex flex-col gap-1 pt-2">
              <h2 className="line-clamp-1 text-base">{product.name}</h2>
              {product.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 max-w-[200px] break-words">
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
  );
}
