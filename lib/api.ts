import axios from "axios";
import { SignInFormValues, SignUpFormValues } from "./schema";
import { getToken, removeToken, setToken } from "./utils";
import {
  type ApiResponse,
  type Product,
  type Category,
  type SellerWithProducts,
  type SellerWithCategories,
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
    const response = await api.post("/api/register", data);
    return response.data;
  },

  async signIn(data: SignInFormValues) {
    const response = await api.post("/api/login", data);
    setToken(response.data.access_token);
    return response.data;
  },

  async signOut() {
    const response = await api.post("/api/logout");
    removeToken();
    return response.data;
  },

  async getUserData() {
    const response = await api.get("/api/user");
    return response.data;
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
export async function getProducts(): Promise<
  ApiResponse<SellerWithProducts[]>
> {
  const response = await apiProduct.get("/api/products");
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
