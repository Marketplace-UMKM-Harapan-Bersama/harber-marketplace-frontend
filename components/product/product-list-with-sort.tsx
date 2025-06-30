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
import { useProducts } from "@/hooks/use-queries";

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
  className?: string;
  gridCols?: "grid-4" | "grid-6";
  itemsPerPage?: number;
}

export function ProductListWithSort({
  searchQuery,
  className,
  gridCols = "grid-6",
  itemsPerPage = 12,
}: ProductListWithSortProps) {
  const [sort, setSort] = useState<SortOption>("relevance");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { isLoading } = useProducts({
    searchQuery,
    sortBy: sort,
    page,
  });

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-6">
        {isLoading ? (
          <Skeleton className="h-10 w-[200px]" />
        ) : (
          <Select
            value={sort}
            onValueChange={(value: SortOption) => setSort(value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <ProductList
        searchQuery={searchQuery}
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
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              )
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
  );
}
