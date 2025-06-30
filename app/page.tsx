import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { dummyProducts } from "@/components/product/dummy";
import { ProductCategories } from "@/components/product/product-categories";
import { ProductList } from "@/components/product/product-list";
import { HeroSection } from "@/components/section/hero";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-col gap-4  py-10 px-10">
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
          <h2 className="text-2xl font-light">Produk Terbaru</h2>
          <p className="text-sm text-muted-foreground font-light pb-4">
            Temukan produk terbaru dari berbagai kategori
          </p>
          <div className="flex overflow-x-auto gap-4 no-scrollbar">
            <ProductList products={dummyProducts} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
