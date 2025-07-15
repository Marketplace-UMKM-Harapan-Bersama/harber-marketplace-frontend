import { useQuery } from "@tanstack/react-query";
import {
  getProduct,
  getProducts,
  getProductCategories,
  getProductsByCategory,
  getCart,
  getOrders,
  getOrder,
  getSeller,
} from "@/lib/api";
import {
  Product,
  PaginatedResponse,
  Category,
  OrderDetailResponse,
  OrderListResponse,
  Seller,
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
      const response = await getProducts({
        categoryId,
        page,
        searchQuery,
        sortBy,
        sellerId,
        excludeProduct,
      });

      const productsWithSellers = await Promise.all(
        response.data.map(async (product) => {
          if (product.image_url && !product.image_url.startsWith("http")) {
            try {
              const sellerResponse = await getSeller(product.seller_id);
              return { ...product, seller: sellerResponse.data };
            } catch (error) {
              console.error(
                `Failed to fetch seller for product ${product.id}`,
                error
              );
              return product;
            }
          }
          return product;
        })
      );

      let products = [...productsWithSellers];

      return {
        ...response,
        data: products,
      } as PaginatedResponse<Product & { seller?: Seller }>;
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

export function usePaginatedProductCategories(page: number) {
  return useQuery({
    queryKey: ["product-categories", { page }],
    queryFn: async () => {
      const response = await getProductCategories(page);
      return response;
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useProductsByCategory(slug: string) {
  return useQuery({
    queryKey: ["category-products", slug],
    queryFn: async () => {
      const response = await getProductsByCategory(slug);
      const categoryData = response.data;

      if (categoryData?.products) {
        const productsWithSellers = await Promise.all(
          categoryData.products.map(async (product) => {
            if (product.image_url && !product.image_url.startsWith("http")) {
              try {
                const sellerResponse = await getSeller(product.seller_id);
                return { ...product, seller: sellerResponse.data };
              } catch (error) {
                console.error(
                  `Failed to fetch seller for product ${product.id}`,
                  error
                );
                return product;
              }
            }
            return product;
          })
        );
        categoryData.products = productsWithSellers as Product[];
      }

      return categoryData;
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
