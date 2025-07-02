import axios, { AxiosError } from "axios";
import { SignInFormValues, SignUpFormValues } from "./schema";
import { getToken } from "./auth-client";
import {
  type ApiResponse,
  type Product,
  type Category,
  type SellerWithProducts,
  type SellerWithCategories,
  Order,
  OrderResponse,
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

  async getUserData() {
    try {
      const response = await api.get("/api/user");
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        throw error;
      }
      throw error;
    }
  },
};

const apiProduct = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PRODUCT_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Product and Category API functions
export async function getProducts(
  categoryId?: number
): Promise<ApiResponse<SellerWithProducts[]>> {
  const url = categoryId
    ? `/api/products?category_id=${categoryId}`
    : "/api/products";
  const response = await apiProduct.get(url);
  return response.data;
}

export async function getProduct(id: number): Promise<ApiResponse<Product>> {
  const response = await apiProduct.get(`/api/products/${id}`);
  return response.data;
}

export async function getCategories(): Promise<
  ApiResponse<SellerWithCategories[]>
> {
  const response = await apiProduct.get("/api/categories");
  return response.data;
}

export async function getCategory(id: number): Promise<ApiResponse<Category>> {
  const response = await apiProduct.get(`/api/categories/${id}`);
  return response.data;
}

export async function getSellerProducts(
  sellerId: number
): Promise<ApiResponse<SellerWithProducts>> {
  const response = await apiProduct.get(`/api/sellers/${sellerId}/products`);
  return response.data;
}

// Order API function
export async function createOrder(orders: Order[]): Promise<OrderResponse> {
  try {
    const response = await apiProduct.post("/api/orders", orders);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || error.message;
      throw new Error(message);
    }
    throw error;
  }
}
