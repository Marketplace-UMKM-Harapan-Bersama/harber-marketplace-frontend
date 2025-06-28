import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { type Product } from "@/lib/types";
import { ProductList } from "./product-list";

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetail({
  product,
  relatedProducts,
}: ProductDetailProps) {
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
              className="h-full w-full object-cover object-center hover:scale-105 transition-all duration-300"
            />
            {product.stock <= 0 && (
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
            <h1 className="text-4xl md:text-7xl font-medium">
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
                <div>
                  <dt className="text-sm text-muted-foreground">SKU</dt>
                  <dd>{product.sku}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Stok</dt>
                  <dd>{product.stock} unit</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Berat</dt>
                  <dd>{product.weight} kg</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Status</dt>
                  <dd>{product.is_active ? "Aktif" : "Tidak Aktif"}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Add to Cart Button */}
          {product.stock > 0 && (
            <Button
              className="p-5 rounded-full w-fit mt-8 border-2 border-primary"
              size="lg"
              variant="default"
            >
              <Plus className="size-4 mr-2" />
              Tambahkan ke keranjang
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

          <ProductList
            products={relatedProducts}
            className="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            excludeProduct={product.id}
          />
        </div>
      </section>
    </div>
  );
}
