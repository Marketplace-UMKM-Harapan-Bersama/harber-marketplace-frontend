"use client";

import { useState, useEffect, useCallback } from "react";
import { ordersApi } from "@/lib/orders/api";
import type { Order, OrdersResponse, OrderFilters, OrderDetail } from "@/lib/orders/types";
import { toast } from "sonner";

export function useOrders(initialFilters?: OrderFilters) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<OrdersResponse["meta"] | null>(
    null
  );
  const [filters, setFilters] = useState<OrderFilters>(initialFilters || {});

  const fetchOrders = useCallback(
    async (newFilters?: OrderFilters) => {
      try {
        setLoading(true);
        setError(null);

        const currentFilters = newFilters || filters;
        const response = await ordersApi.getOrders(currentFilters);

        setOrders(response.data);
        setPagination(response.meta);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch orders";
        setError(errorMessage);
        toast.error("Gagal memuat pesanan", {
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      await ordersApi.updateOrderStatus(orderId, status);

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status: status as Order["status"] }
            : order
        )
      );

      toast.success("Status pesanan berhasil diperbarui");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update order status";
      toast.error("Gagal memperbarui status pesanan", {
        description: errorMessage,
      });
      throw err;
    }
  };

  const updateTracking = async (
    orderId: number,
    trackingNumber: string,
    courier: string
  ) => {
    try {
      await ordersApi.updateTracking(orderId, trackingNumber, courier);

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                tracking_number: trackingNumber,
                courier,
                status: "shipped",
              }
            : order
        )
      );

      toast.success("Informasi tracking berhasil diperbarui");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update tracking";
      toast.error("Gagal memperbarui informasi tracking", {
        description: errorMessage,
      });
      throw err;
    }
  };

  const applyFilters = (newFilters: OrderFilters) => {
    setFilters(newFilters);
    fetchOrders(newFilters);
  };

  const refreshOrders = () => {
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    pagination,
    filters,
    updateOrderStatus,
    updateTracking,
    applyFilters,
    refreshOrders,
  };
}

export function useOrderStats() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    completed: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await ordersApi.getOrderStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch order stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
}

// Update the useOrder hook to work with the simplified API
export function useOrder(id: number) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ordersApi.getOrder(id);
      setOrder(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch order";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id, fetchOrder]);

  return {
    order,
    loading,
    error,
    refetch: fetchOrder,
  };
}
