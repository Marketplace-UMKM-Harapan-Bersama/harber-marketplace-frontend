import { ProductList } from "@/components/product/product-list";
import { dummyProducts } from "@/components/product/dummy-product";

export   default function ProductsPage() {
  return (
    <div className="container py-10 px-10">
      <h1 className="mb-8 text-2xl font-bold">Produk Terbaru</h1>
      <ProductList
        products={dummyProducts}
        className="grid-cols-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      />
    </div>
  );
}
