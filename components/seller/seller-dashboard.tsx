"use client";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  Clock,
  // Eye,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

export function SellerDashboard({ stats }: SellerDashboardProps) {
  const syncPercentage = (stats.syncedProducts / stats.totalProducts) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard Seller
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

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>{stats.syncedProducts} tersinkronisasi</span>
              <Badge variant="secondary" className="text-xs">
                {syncPercentage.toFixed(0)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{stats.pendingOrders} menunggu proses</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pendapatan Bulan Ini
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {stats.monthlyRevenue.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-muted-foreground">
              Total: Rp {stats.totalRevenue.toLocaleString("id-ID")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pengunjung Toko
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalViews.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              +12% dari bulan lalu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Pesanan Terbaru</CardTitle>
          <CardDescription>Pesanan yang perlu segera diproses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">#MP-2024-{1000 + i}</p>
                  <p className="text-xs text-muted-foreground">
                    2 produk • Rp 150.000
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    Menunggu Proses
                  </Badge>
                  <Button size="sm">Proses</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
