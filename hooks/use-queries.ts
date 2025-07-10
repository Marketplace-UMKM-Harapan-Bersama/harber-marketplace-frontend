import { useQuery } from "@tanstack/react-query";
import {
  getProduct,
  getProducts,
  getProductCategories,
  getProductsByCategory,
  getCart,
  getOrders,
  getOrder,
} from "@/lib/api";
import {
  Product,
  PaginatedResponse,
  Category,
  OrderDetailResponse,
  OrderListResponse,
} from "@/lib/types";

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
      const response = await getProducts(categoryId, page);
      let products = [...response.data];

      // Apply filters
      if (sellerId) {
        products = products.filter((product) => product.seller_id === sellerId);
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
          products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
          break;
        case "price_desc":
          products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
          break;
        case "latest":
          products.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
          break;
        // For "relevance" and "trending", we'll keep the default order
      }

      return {
        ...response,
        data: products,
      } as PaginatedResponse<Product>;
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const response = await getProduct(slug);
      return response.data;
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getProductCategories();
      return response.data;
    },
  }) as { data: Category[] | undefined; isLoading: boolean; error: any };
}

export function useProductsByCategory(slug: string) {
  return useQuery({
    queryKey: ["category-products", slug],
    queryFn: async () => {
      const response = await getProductsByCategory(slug);
      return response.data;
    },
  });
}

export function useCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await getCart();
      return response;
    },
  });
}

export function useOrders() {
  return useQuery<OrderListResponse>({
    queryKey: ["orders"],
    queryFn: getOrders,
  });
}

export function useOrder(id: number) {
  return useQuery<OrderDetailResponse>({
    queryKey: ["order", id],
    queryFn: () => getOrder(id),
  });
}
