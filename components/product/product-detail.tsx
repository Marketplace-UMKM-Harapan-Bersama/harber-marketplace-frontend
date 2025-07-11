"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { ProductList } from "./product-list";
import { Skeleton } from "../ui/skeleton";
import { useCartStore } from "@/lib/store";
import { useProduct } from "@/hooks/use-queries";
import { useAuth } from "@/hooks/use-auth";
import { Product } from "@/lib/types";

interface ProductDetailProps {
  slug: string;
}

interface CartItem extends Omit<Product, "price"> {
  price: number;
  quantity: number;
}

export function ProductDetail({ slug }: ProductDetailProps) {
  const { data: product, isLoading, error } = useProduct(slug);
  const addToCart = useCartStore((state) => state.addItem);
  const cartLoading = useCartStore((state) => state.isLoading);
  const { isAuthed } = useAuth();

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      // Transform product data to match CartItem type
      const cartItem: Omit<CartItem, "quantity"> = {
        ...product,
        price: parseFloat(product.price),
      };

      await addToCart(cartItem);
    } catch (error) {
      console.error(error);
    }
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
    <>
      <div className="flex flex-col items-center justify-between px-5 py-5 md:px-10 md:py-10 bg-muted rounded-md border container mx-auto">
        <div className="flex md:flex-row flex-col w-full gap-x-8">
          {/* Product Image */}
          <div className="w-full md:w-1/2">
            <div className="aspect-square overflow-hidden relative">
              <Image
                src={product.image_url || "/default-image.png"}
                alt={product.name}
                fill
                onError={(e) => {
                  e.currentTarget.srcset = "";
                  e.currentTarget.src = "/default-image.png";
                }}
                placeholder="empty"
                className="rounded-lg h-full w-full object-cover object-center fade-in-0"
              />
              {product.stock <= 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-foreground text-white px-6 py-3 font-semibold text-lg">
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
            <Badge className="font-mono text-xl font-bold mt-4 border-primary border-2 w-fit">
              {formatPrice(parseFloat(product.price))}
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
                  <div>
                    <dt className="text-sm text-muted-foreground">Stok</dt>
                    <dd>{product.stock} unit</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Berat</dt>
                    <dd>{product.weight} kg</dd>
                  </div>
                  {product.category && (
                    <div>
                      <dt className="text-sm text-muted-foreground">
                        Kategori
                      </dt>
                      <dd>{product.category.name}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {/* Add to Cart Button */}
            {isAuthed ? (
              <>
                {product.stock > 0 && (
                  <Button
                    className="p-5 w-fit mt-8 border-2 border-primary"
                    size="lg"
                    variant="default"
                    onClick={handleAddToCart}
                    disabled={cartLoading}
                  >
                    <Plus className="size-4 mr-2" />
                    {cartLoading ? "Menambahkan..." : "Tambahkan ke keranjang"}
                  </Button>
                )}
              </>
            ) : (
              <Button
                className="p-5 w-fit mt-8 border-2 border-primary"
                asChild
              >
                <Link href="/sign-in">Masuk untuk membeli</Link>
              </Button>
            )}

            {product.stock <= 0 && (
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
      </div>

      {/* Related Products */}
      <section className="w-full mt-24 mb-12">
        <div className="container mx-auto">
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
              sellerId={product.seller_id}
              gridCols="scroll"
              isPaginated={false}
              sortBy="latest"
              excludeProduct={product.id}
            />
          </div>
        </div>
      </section>
    </>
  );
}

function ProductSkeleton() {
  return (
    <div className="flex  flex-col items-center justify-between px-5 py-10 bg-muted rounded-md border container mx-auto">
      <div className="flex md:flex-row flex-col w-full  gap-x-8">
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
                <Skeleton key={i} className="h-9 w-24 " />
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
          <Skeleton className="h-12 w-48  mt-8" />
        </div>
      </div>
    </div>
  );
}
