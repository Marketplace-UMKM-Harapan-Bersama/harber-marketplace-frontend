import { ProductDetail } from "@/components/product/product-detail";

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  return <ProductDetail slug={slug} />;
}
