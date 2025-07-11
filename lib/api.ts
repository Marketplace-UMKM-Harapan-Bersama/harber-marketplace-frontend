import axios, { AxiosError } from "axios";
import { SignInFormValues, SignUpFormValues } from "./schema";
import { getToken } from "./auth-client";
import {
  type ApiResponse,
  type Product,
  type Category,
  type SellerWithProducts,
  type SellerWithCategories,
  type User,
  type UserResponse,
  type CartResponse,
  type CartItem,
  type Order,
  type OrderResponse,
  type PaginatedResponse,
  type OrderListResponse,
  type OrderDetailResponse,
} from "./types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    CLIENT_ID: process.env.NEXT_PUBLIC_CLIENT_ID || "",
    CLIENT_SECRET: process.env.NEXT_PUBLIC_CLIENT_SECRET || "",
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  async signUp(data: SignUpFormValues) {
    try {
      const response = await api.post("/api/register", data);
      const { data: responseData } = response;

      // For 200 status, consider it a success even if success flag isn't present
      if (response.status === 200) {
        return {
          success: true,
          message: responseData.message || "Pendaftaran berhasil!",
          data: responseData.data,
        };
      }

      // If we get here without a 200 status, throw an error
      throw new Error(
        responseData.message || "Gagal mendaftar. Silakan coba lagi."
      );
    } catch (error) {
      // Handle Axios errors (network, 4xx, 5xx)
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
      }
      // Re-throw other errors
      throw error;
    }
  },

  async signIn(data: SignInFormValues) {
    try {
      const response = await api.post("/api/login", data);
      const { data: responseData } = response;

      if (!responseData.success && responseData.message) {
        throw new Error(responseData.message);
      }

      return responseData;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
      }
      throw error;
    }
  },

  async signOut() {
    try {
      const response = await api.post("/api/logout");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getUserData(): Promise<User> {
    try {
      const response = await api.get<UserResponse>("/api/user");
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        throw error;
      }
      throw error;
    }
  },
};

// Product and Category API functions
export async function getProducts(
  categoryId?: number,
  page: number = 1
): Promise<PaginatedResponse<Product>> {
  const url = categoryId
    ? `/api/products?category_id=${categoryId}&page=${page}`
    : `/api/products?page=${page}`;
  const response = await api.get(url);
  return response.data;
}

export async function getProduct(slug: string): Promise<ApiResponse<Product>> {
  const response = await api.get(`/api/products/${slug}`);
  return response.data;
}

export async function getCategories(): Promise<
  ApiResponse<SellerWithCategories[]>
> {
  const response = await api.get("/api/categories");
  return response.data;
}

export async function getCategory(id: number): Promise<ApiResponse<Category>> {
  const response = await api.get(`/api/categories/${id}`);
  return response.data;
}

export async function getSellerProducts(
  sellerId: number
): Promise<ApiResponse<SellerWithProducts>> {
  const response = await api.get(`/api/sellers/${sellerId}/products`);
  return response.data;
}

export async function getProductCategories(): Promise<
  PaginatedResponse<Category>
> {
  const response = await api.get("/api/product-categories");
  return response.data;
}

export async function getProductsByCategory(
  slug: string
): Promise<ApiResponse<Category & { products: Product[] }>> {
  const response = await api.get(`/api/product-categories/${slug}`);
  return response.data;
}

// Order API function
export async function createOrder(orders: Order[]): Promise<OrderResponse> {
  try {
    const response = await api.post("/api/orders", orders);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || error.message;
      throw new Error(message);
    }
    throw error;
  }
}

// Cart API functions
export async function getCart(): Promise<CartResponse> {
  const response = await api.get("/api/cart");
  return response.data;
}

export interface CheckoutResponse {
  message: string;
  order_id: number;
  snap_token: string;
  midtrans_redirect_url: string;
}

export interface CheckoutRequest {
  shipping_address: string;
  shipping_city: string;
  shipping_province: string;
  shipping_postal_code: string;
  payment_method: string;
  notes?: string;
}

export async function checkoutCart(
  data: CheckoutRequest
): Promise<CheckoutResponse> {
  const response = await api.post("/api/cart/checkout", data);
  return response.data;
}

export async function addToCart(
  productId: number,
  quantity: number
): Promise<ApiResponse<CartItem>> {
  const response = await api.post(`/api/products/${productId}/add-to-cart`, {
    quantity,
  });
  return response.data;
}

export async function increaseCartItemQuantity(
  productId: number
): Promise<ApiResponse<CartItem>> {
  const response = await api.patch(`/api/cart/product/${productId}/increase`);
  return response.data;
}

export async function decreaseCartItemQuantity(
  productId: number
): Promise<ApiResponse<CartItem>> {
  const response = await api.patch(`/api/cart/product/${productId}/decrease`);
  return response.data;
}

export async function removeFromCart(
  cartItemId: number
): Promise<ApiResponse<void>> {
  const response = await api.delete(`/api/cart/${cartItemId}`);
  return response.data;
}

export async function clearCart(): Promise<ApiResponse<void>> {
  const response = await api.delete("/api/clear-cart");
  return response.data;
}

export async function getOrders(): Promise<OrderListResponse> {
  const response = await api.get("/api/orders");
  return response.data;
}

export async function getOrder(id: number): Promise<OrderDetailResponse> {
  const response = await api.get(`/api/order/${id}`);
  return response.data;
}
