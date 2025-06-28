import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { type Product } from "@/lib/types";

interface ProductListProps {
  products: Product[];
  className?: string;
  excludeProduct?: number;
}

export function ProductList({
  products,
  className = "",
  excludeProduct,
}: ProductListProps) {
  const displayProducts = excludeProduct
    ? products.filter((p) => p.id !== excludeProduct)
    : products;

  return (
    <div className={`grid gap-6 ${className}`}>
      {displayProducts.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`}>
          <Card className="group h-full p-0 overflow-hidden border-none shadow-none">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col gap-2 px-6">
              <h2 className="font-semibold line-clamp-1">{product.name}</h2>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-muted-foreground">
                  Stok: {product.stock}
                </span>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
