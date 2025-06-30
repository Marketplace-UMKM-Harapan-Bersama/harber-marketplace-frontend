import { ProductCategories } from "@/components/product/product-categories";
import { ProductList } from "@/components/product/product-list";
import { HeroSection } from "@/components/section/hero";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex flex-col gap-4 py-10 px-10">
        <section className="flex flex-col gap-4">
          <HeroSection />
        </section>
        <section className="flex items-center justify-center gap-4">
          <Button variant={"outline"} className="rounded-full" asChild>
            <Link href={"/categories"}>Lihat Semua</Link>
          </Button>
          <ProductCategories />
        </section>

        <section className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-light">Produk Terbaru</h2>
              <p className="text-sm text-muted-foreground font-light">
                Temukan produk terbaru dari berbagai kategori
              </p>
            </div>
            <Button variant="link" className="text-primary" asChild>
              <Link href="/search">Lihat Semua</Link>
            </Button>
          </div>
          <ProductList gridCols="scroll" isPaginated={false} sortBy="latest" />
        </section>

        <section className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-light">Produk Terpopuler</h2>
              <p className="text-sm text-muted-foreground font-light">
                Temukan produk terpopuler dari berbagai kategori
              </p>
            </div>
          </div>
          <ProductList
            gridCols="scroll"
            isPaginated={false}
            sortBy="trending"
          />
        </section>

        <section className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-light">Produk Termurah</h2>
              <p className="text-sm text-muted-foreground font-light">
                Temukan produk termurah dari berbagai kategori
              </p>
            </div>
          </div>
          <ProductList
            gridCols="grid-6"
            isPaginated={false}
            sortBy="price_asc"
          />
        </section>
      </div>
    </>
  );
}
