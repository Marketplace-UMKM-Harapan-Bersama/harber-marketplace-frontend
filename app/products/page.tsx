import { ProductList } from "@/components/product/product-list";
import { dummyProducts } from "@/components/product/dummy";

export default function ProductsPage() {
  return (
    <div className="container py-10 px-10">
      <h1 className="mb-8 text-2xl font-bold">Produk Terbaru</h1>
      <div className="flex overflow-x-auto gap-4 w-full">
        <ProductList products={dummyProducts} />
      </div>
    </div>
  );
}
