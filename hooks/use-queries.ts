import { useQuery } from "@tanstack/react-query";
import { getCategories, getProduct, getProducts } from "@/lib/api";
import { slugify } from "@/lib/utils";

interface UseProductsOptions {
  sellerId?: number;
  excludeProduct?: number;
  searchQuery?: string;
  categoryId?: number;
  sortBy?: "relevance" | "trending" | "latest" | "price_asc" | "price_desc";
  page?: number;
}

export function useProducts({
  sellerId,
  excludeProduct,
  searchQuery,
  categoryId,
  sortBy = "relevance",
  page = 1,
}: UseProductsOptions = {}) {
  return useQuery({
    queryKey: [
      "products",
      { sellerId, excludeProduct, searchQuery, categoryId, sortBy, page },
    ],
    queryFn: async () => {
      const response = await getProducts(categoryId);
      let products = response.data.flatMap((seller) =>
        seller.products.map((product) => ({
          ...product,
          seller: {
            id: seller.seller_id,
            shop_name: seller.shop_name,
          },
        }))
      );

      // Apply filters
      if (sellerId) {
        products = products.filter(
          (product) => product.seller?.id === sellerId
        );
      }

      if (excludeProduct) {
        products = products.filter((product) => product.id !== excludeProduct);
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        products = products.filter(
          (product) =>
            product.name.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query)
        );
      }

      // Apply sorting
      switch (sortBy) {
        case "price_asc":
          products.sort((a, b) => a.price - b.price);
          break;
        case "price_desc":
          products.sort((a, b) => b.price - a.price);
          break;
        case "latest":
          products.sort(
            (a, b) =>
              new Date(b.created_at || "").getTime() -
              new Date(a.created_at || "").getTime()
          );
          break;
        // For "relevance" and "trending", we'll keep the default order
      }

      return products;
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      // First get all products to find the ID from slug
      const response = await getProducts();
      const products = response.data.flatMap((seller) =>
        seller.products.map((product) => ({
          ...product,
          seller: {
            id: seller.seller_id,
            shop_name: seller.shop_name,
          },
        }))
      );

      const productWithId = products.find(
        (product) => slugify(product.name) === slug
      );

      if (!productWithId) {
        throw new Error("Product not found");
      }

      // Then get the detailed product data
      const productResponse = await getProduct(productWithId.id);
      const productData = productResponse.data;

      return {
        ...productData,
        seller: productData.seller ?? {
          id: 0,
          shop_name: "Unknown Seller",
        },
        category: productData.category,
      };
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories();
      return response.data.flatMap((seller) =>
        seller.categories.map((category) => ({
          ...category,
          seller: {
            id: seller.seller_id,
            shop_name: seller.shop_name,
          },
        }))
      );
    },
  });
}
