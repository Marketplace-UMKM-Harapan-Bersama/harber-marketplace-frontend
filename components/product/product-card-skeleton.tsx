import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ProductCardSkeletonProps {
  className?: string;
  isScrollable?: boolean;
}

export function ProductCardSkeleton({
  className,
  isScrollable,
}: ProductCardSkeletonProps) {
  return (
    <div
      className={cn(
        "block",
        isScrollable && "snap-start min-w-[280px] first:ml-0",
        className
      )}
    >
      <div className="rounded-lg h-full overflow-hidden">
        <Skeleton className="aspect-square rounded-lg" />
        <div className="flex flex-col gap-2 pt-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-10 w-full" />
          <div className="flex items-center justify-between mt-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
