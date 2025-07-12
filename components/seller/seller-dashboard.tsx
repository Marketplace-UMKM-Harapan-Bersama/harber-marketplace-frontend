"use client";

import { SellerDetail } from "./seller";

// import { OrderManagement } from "./orders/order-management";

interface DashboardStats {
  totalProducts: number;
  syncedProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalViews: number;
}

interface SellerDashboardProps {
  stats: DashboardStats;
}

export function SellerDashboard({  }: SellerDashboardProps) {

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Kelola toko dan pantau performa penjualan Anda
          </p>
        </div>
        {/* <Button>
          <Eye className="w-4 h-4 mr-2" />
          Lihat Toko di Marketplace
        </Button> */}
      </div>

      <SellerDetail />

      {/* <OrderManagement /> */}
    </div>
  );
}
