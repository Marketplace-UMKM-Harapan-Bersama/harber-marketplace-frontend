import CategoryList from "@/components/categories/category-list";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function CategoriesPage() {
  return (
    <div className="py-8">
      <Suspense
        fallback={
          <div className="space-y-4">
            <Skeleton className="h-12 w-1/4" />
            <Skeleton className="h-96 w-full" />
            <div className="flex justify-center">
              <Skeleton className="h-10 w-80" />
            </div>
          </div>
        }
      >
        <CategoryList />
      </Suspense>
    </div>
  );
}

export default CategoriesPage;
