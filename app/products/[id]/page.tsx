"use client";

import Link from "next/link";
import { use } from "react";

import { Button } from "@/components/ui/button";
import { ProductDetail } from "@/components/product/product-detail";
import { dummyProducts } from "@/components/product/dummy-product";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = use(params);
  const product = dummyProducts.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-medium">Produk tidak ditemukan</h2>
          <p className="text-muted-foreground mt-2">
            Produk yang kamu cari tidak ada.
          </p>
          <Button asChild className="mt-4">
            <Link href="/products">Lihat Produk Lainnya</Link>
          </Button>
        </div>
      </div>
    );
  }

  const relatedProducts = dummyProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 5);

  return <ProductDetail product={product} relatedProducts={relatedProducts} />;
}
