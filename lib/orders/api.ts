import axios, { AxiosError } from "axios";
import { getToken } from "../auth-client";
import type {
  Order,
  OrdersResponse,
  OrderUpdateRequest,
  OrderFilters,
} from "./types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
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

export const ordersApi = {
  /**
   * Get orders with optional filters
   */
  async getOrders(filters?: OrderFilters): Promise<OrdersResponse> {
    try {
      const params = new URLSearchParams();

      if (filters?.status) params.append("status", filters.status);
      if (filters?.search) params.append("search", filters.search);
      if (filters?.page) params.append("page", filters.page.toString());
      if (filters?.per_page)
        params.append("per_page", filters.per_page.toString());
      if (filters?.date_from) params.append("date_from", filters.date_from);
      if (filters?.date_to) params.append("date_to", filters.date_to);

      const response = await api.get(`/api/orders?${params.toString()}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
      }
      throw error;
    }
  },

  /**
   * Get single order by ID
   */
  async getOrder(id: number): Promise<{ data: Order }> {
    try {
      const response = await api.get(`/api/orders/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
      }
      throw error;
    }
  },

  /**
   * Update order status and other details
   */
  async updateOrder(
    id: number,
    data: OrderUpdateRequest
  ): Promise<{ data: Order }> {
    try {
      const response = await api.put(`/api/orders/${id}`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
      }
      throw error;
    }
  },

  /**
   * Update order status only
   */
  async updateOrderStatus(
    id: number,
    status: string
  ): Promise<{ data: Order }> {
    return this.updateOrder(id, { status });
  },

  /**
   * Update tracking information
   */
  async updateTracking(
    id: number,
    trackingNumber: string,
    courier: string
  ): Promise<{ data: Order }> {
    return this.updateOrder(id, {
      tracking_number: trackingNumber,
      courier,
      status: "shipped", // Automatically set status to shipped when adding tracking
    });
  },

  /**
   * Get order statistics
   */
  async getOrderStats(): Promise<{
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    completed: number;
    cancelled: number;
  }> {
    try {
      const response = await api.get("/api/orders/stats");
      return response.data.data;
    } catch (error) {
      console.log("Error fetching order stats:", error);

      // If stats endpoint doesn't exist, return default values
      return {
        total: 0,
        pending: 0,
        processing: 0,
        shipped: 0,
        completed: 0,
        cancelled: 0,
      };
    }
  },
};
