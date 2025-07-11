import axios, { AxiosError } from "axios";
import { getToken } from "../auth-client";
import type {
  Order,
  OrdersResponse,
  OrderUpdateRequest,
  OrderFilters,
  OrderDetail,
  ApiOrderResponse,
  ApiOrdersResponse,
  ApiOrderDetailResponse,
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

// Helper function to transform API response to expected format
const transformOrderData = (apiOrder: ApiOrderResponse): Order => {
  return {
    id: apiOrder.id,
    order_number: apiOrder.order_number,
    user_id: apiOrder.user_id,
    seller_id: apiOrder.seller_id,
    total_amount: Number.parseFloat(apiOrder.total_amount) || 0,
    shipping_cost: Number.parseFloat(apiOrder.shipping_cost) || 0,
    payment_method: apiOrder.payment_method || "",
    status: (apiOrder.order_status ||
      apiOrder.payment_status ||
      "pending") as Order["status"],
    shipping_address: apiOrder.shipping_address || "",
    shipping_city: apiOrder.shipping_city || "",
    shipping_province: apiOrder.shipping_province || "",
    shipping_postal_code: apiOrder.shipping_postal_code || "",
    tracking_number: apiOrder.tracking_number,
    courier: apiOrder.courier,
    notes: apiOrder.notes,
    created_at: apiOrder.created_at,
    updated_at: apiOrder.updated_at,
    customer: apiOrder.customer,
    seller: apiOrder.seller,
    items: apiOrder.items || apiOrder.order_items,
  };
};

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

      const response = await api.get<ApiOrdersResponse>(
        `/api/orders?${params.toString()}`
      );

      // Transform the data
      const transformedData = response.data.data?.map(transformOrderData) || [];

      return {
        data: transformedData,
        links: response.data.links,
        meta: response.data.meta,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
      }
      throw error;
    }
  },

  /**
   * Get single order by ID - Fixed to match actual API response
   */
  async getOrder(id: number): Promise<OrderDetail> {
    try {
      const response = await api.get<ApiOrderDetailResponse>(
        `/api/order/${id}`
      );

      // The API returns data wrapped in a "data" object
      if (response.data.data) {
        const orderData = response.data.data;

        return {
          id: orderData.id,
          user_id: orderData.user_id,
          seller_id: orderData.seller_id,
          order_number: orderData.order_number,
          total_amount: orderData.total_amount,
          shipping_cost: orderData.shipping_cost,
          payment_method: orderData.payment_method,
          payment_status: orderData.payment_status,
          order_status: orderData.order_status,
          shipping_address: orderData.shipping_address,
          shipping_city: orderData.shipping_city,
          shipping_province: orderData.shipping_province,
          shipping_postal_code: orderData.shipping_postal_code,
          notes: orderData.notes,
          items: orderData.items || [],
          created_at: orderData.created_at,
          updated_at: orderData.updated_at,
          // Computed properties for backward compatibility
          total: Number.parseFloat(orderData.total_amount) || 0,
          order_items: orderData.items || [],
        };
      }

      throw new Error("Invalid response format");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new Error("Pesanan tidak ditemukan");
        }
        if (error.response?.status === 401) {
          throw new Error("Anda tidak memiliki akses ke pesanan ini");
        }
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
      const response = await api.put<{ data: ApiOrderResponse }>(
        `/api/order/${id}`,
        data
      );
      return {
        data: transformOrderData(response.data.data),
      };
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
      status: "shipped",
    });
  },

  /**
   * Calculate order statistics from existing orders data
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
      // Get all orders to calculate stats
      const response = await this.getOrders({ per_page: 1000 }); // Get large number to count all
      const orders = response.data || [];

      const stats = {
        total: orders.length,
        pending: 0,
        processing: 0,
        shipped: 0,
        completed: 0,
        cancelled: 0,
      };

      // Count each status
      orders.forEach((order: Order) => {
        if (stats.hasOwnProperty(order.status)) {
          stats[order.status as keyof typeof stats]++;
        }
      });

      return stats;
    } catch (error) {
      console.log("Error calculating order stats:", error);
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
