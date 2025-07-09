import axios, { AxiosError } from "axios"
import { getToken } from "../auth-client"
import type { Order, OrdersResponse, OrderUpdateRequest, OrderFilters, OrderDetail } from "./types"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

export const ordersApi = {
  /**
   * Get orders with optional filters
   */
  async getOrders(filters?: OrderFilters): Promise<OrdersResponse> {
    try {
      const params = new URLSearchParams()

      if (filters?.status) params.append("status", filters.status)
      if (filters?.search) params.append("search", filters.search)
      if (filters?.page) params.append("page", filters.page.toString())
      if (filters?.per_page) params.append("per_page", filters.per_page.toString())
      if (filters?.date_from) params.append("date_from", filters.date_from)
      if (filters?.date_to) params.append("date_to", filters.date_to)

      const response = await api.get(`/api/orders?${params.toString()}`)
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || error.message
        throw new Error(message)
      }
      throw error
    }
  },

  /**
   * Get single order by ID - Updated for actual API
   */
  async getOrder(id: number): Promise<OrderDetail> {
    try {
      const response = await api.get(`/api/order/${id}`)

      // Handle direct response (not wrapped in data object)
      if (response.data.id) {
        return response.data
      }

      // Handle wrapped response
      if (response.data.data) {
        return response.data.data
      }

      throw new Error("Invalid response format")
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new Error("Pesanan tidak ditemukan")
        }
        if (error.response?.status === 401) {
          throw new Error("Anda tidak memiliki akses ke pesanan ini")
        }
        const message = error.response?.data?.message || error.message
        throw new Error(message)
      }
      throw error
    }
  },

  /**
   * Update order status and other details
   */
  async updateOrder(id: number, data: OrderUpdateRequest): Promise<{ data: Order }> {
    try {
      const response = await api.put(`/api/orders/${id}`, data)
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || error.message
        throw new Error(message)
      }
      throw error
    }
  },

  /**
   * Update order status only
   */
  async updateOrderStatus(id: number, status: string): Promise<{ data: Order }> {
    return this.updateOrder(id, { status })
  },

  /**
   * Update tracking information
   */
  async updateTracking(id: number, trackingNumber: string, courier: string): Promise<{ data: Order }> {
    return this.updateOrder(id, {
      tracking_number: trackingNumber,
      courier,
      status: "shipped", 
    })
  },

  /**
   * Calculate order statistics from existing orders data
   */
  async getOrderStats(): Promise<{
    total: number
    pending: number
    processing: number
    shipped: number
    completed: number
    cancelled: number
  }> {
    try {
      // Get all orders to calculate stats
      const response = await this.getOrders({ per_page: 1000 }) // Get large number to count all
      const orders = response.data || []

      const stats = {
        total: orders.length,
        pending: 0,
        processing: 0,
        shipped: 0,
        completed: 0,
        cancelled: 0,
      }

      // Count each status
      orders.forEach((order: Order) => {
        if (stats.hasOwnProperty(order.status)) {
          stats[order.status as keyof typeof stats]++
        }
      })

      return stats
    } catch (error) {
      console.log("Error calculating order stats:", error)
      return {
        total: 0,
        pending: 0,
        processing: 0,
        shipped: 0,
        completed: 0,
        cancelled: 0,
      }
    }
  },
}
