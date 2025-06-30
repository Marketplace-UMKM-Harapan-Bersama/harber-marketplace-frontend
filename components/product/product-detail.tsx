"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice, isAuthenticated } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { ProductList } from "./product-list";
import { Skeleton } from "../ui/skeleton";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";
import { useProduct } from "@/hooks/use-queries";

interface ProductDetailProps {
  slug: string;
}

export function ProductDetail({ slug }: ProductDetailProps) {
  const { data: product, isLoading, error } = useProduct(slug);
  const addToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (!product || product.stock === undefined) return;

    // Transform product data to match CartItem type
    const cartItem = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      stock: product.stock,
      seller: {
        id: product.seller?.id || 0,
        shop_name: product.seller?.shop_name || "Unknown Seller",
      },
      category: product.category,
    };

    addToCart(cartItem);
    toast.success("Produk ditambahkan ke keranjang");
  };

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (error || !product) {
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-between py-10">
      <div className="flex md:flex-row flex-col w-full max-w-4xl gap-x-8 px-5">
        {/* Product Image */}
        <div className="w-full md:w-1/2">
          <div className="aspect-square overflow-hidden relative">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="rounded-lg h-full w-full object-cover object-center hover:scale-105 transition-all duration-300"
            />
            {product.stock !== undefined && product.stock <= 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-foreground text-white px-6 py-3 rounded-full font-semibold text-lg">
                  Habis
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="flex items-start justify-between">
            <h1 className="text-4xl md:text-5xl font-medium">
              <span className="block">{product.name}</span>
            </h1>
          </div>
          <Badge className="font-mono text-xl font-bold mt-4 rounded-full border-primary border-2 w-fit">
            {formatPrice(product.price)}
          </Badge>

          <Separator className="my-4" />

          {product.description && (
            <p className="text-md text-muted-foreground mt-4">
              {product.description}
            </p>
          )}

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <h2 className="font-semibold">Detail Produk</h2>
              <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {product.seller && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Toko</dt>
                    <dd>{product.seller.shop_name}</dd>
                  </div>
                )}
                {product.stock !== undefined && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Stok</dt>
                    <dd>{product.stock} unit</dd>
                  </div>
                )}
                {product.weight !== undefined && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Berat</dt>
                    <dd>{product.weight} kg</dd>
                  </div>
                )}
                {product.category && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Kategori</dt>
                    <dd>{product.category.name}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Add to Cart Button */}
          {isAuthenticated() ? (
            <>
              {product.stock !== undefined && product.stock > 0 && (
                <Button
                  className="p-5 rounded-full w-fit mt-8 border-2 border-primary"
                  size="lg"
                  variant="default"
                  onClick={handleAddToCart}
                >
                  <Plus className="size-4 mr-2" />
                  Tambahkan ke keranjang
                </Button>
              )}
            </>
          ) : (
            <Button
              className="p-5 rounded-full w-fit mt-8 border-2 border-primary"
              asChild
            >
              <Link href="/sign-in">Masuk untuk membeli</Link>
            </Button>
          )}

          {product.stock !== undefined && product.stock <= 0 && (
            <div className="flex h-full pt-4">
              <p className="text-muted-foreground text-xl">
                Produk ini Habis, silahkan pilih produk{" "}
                <Link href="/products" className="text-primary underline">
                  lainnya
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <section className="w-full mt-24 mb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-2 mb-8">
            <h2 className="text-2xl font-medium text-center">
              Produk yang mungkin Anda sukai
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              Rekomendasi produk serupa untuk Anda
            </p>
          </div>

          <div className="flex overflow-x-auto gap-4 no-scrollbar">
            <ProductList
              sellerId={product.seller?.id}
              gridCols="scroll"
              isPaginated={false}
              sortBy="latest"
              excludeProduct={product.id}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between px-5 py-10">
      <div className="flex md:flex-row flex-col w-full max-w-4xl gap-x-8">
        {/* Product Image Skeleton */}
        <div className="w-full md:w-1/2">
          <div className="aspect-square">
            <Skeleton className="h-full w-full" />
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="flex flex-col items-start gap-2">
            <Skeleton className="h-16 w-3/4" />
            <Skeleton className="h-16 w-3/4" />
          </div>
          <Skeleton className="h-8 w-32 mt-4" />

          <Separator className="my-4" />

          {/* Variants Selection Skeleton */}
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <div className="mt-2 flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-24 rounded-full" />
              ))}
            </div>
          </div>

          {/* Description Skeleton */}
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>

          {/* Add to Cart Button Skeleton */}
          <Skeleton className="h-12 w-48 rounded-full mt-8" />
        </div>
      </div>
    </div>
  );
}
