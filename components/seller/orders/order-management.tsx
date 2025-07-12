"use client";

import * as React from "react";
import {
  Clock,
  Package,
  Truck,
  CheckCircle,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  Eye,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useOrders } from "@/hooks/use-orders";
import type { Order } from "@/lib/orders/types";
import { TrackingInput } from "../shipping/tracking-input";
import { useRouter } from "next/navigation";

const statusConfig = {
  pending: {
    label: "Menunggu Proses",
    icon: Clock,
    variant: "secondary" as const,
  },
  processing: {
    label: "Sedang Diproses",
    icon: Package,
    variant: "default" as const,
  },
  shipped: {
    label: "Sedang Dikirim",
    icon: Truck,
    variant: "default" as const,
  },
  delivered: {
    label: "Diterima",
    icon: CheckCircle,
    variant: "default" as const,
  },
  completed: {
    label: "Selesai",
    icon: CheckCircle,
    variant: "default" as const,
  },
  cancelled: {
    label: "Dibatalkan",
    icon: AlertCircle,
    variant: "destructive" as const,
  },
};
 
// Default status config for unknown statuses
const defaultStatusConfig = {
  label: "Status Tidak Dikenal",
  icon: AlertCircle,
  variant: "secondary" as const,
};

// Coming Soon Modal Component
const ComingSoonModal = ({ isOpen, onClose, feature }: { isOpen: boolean; onClose: () => void; feature: string }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Fitur Segera Hadir</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-center py-4">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            Fitur <strong>{feature}</strong> sedang dalam pengembangan dan akan segera tersedia.
          </p>
          <p className="text-sm text-muted-foreground">
            Terima kasih atas kesabaran Anda!
          </p>
        </div>
        <Button onClick={onClose} className="w-full">
          Tutup
        </Button>
      </div>
    </div>
  );
};

export function OrderManagement() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [activeTab, setActiveTab] = React.useState("all");
  const [filters] = React.useState({});
  const [showComingSoon, setShowComingSoon] = React.useState(false);
  const [comingSoonFeature] = React.useState("");

  const {
    orders,
    loading,
    error,
    pagination,
    // updateOrderStatus,
    updateTracking,
    applyFilters,
    refreshOrders,
  } = useOrders();

  const stats = React.useMemo(() => {
    if (!orders.length) {
      return {
        total: 0,
        pending: 0,
        processing: 0,
        shipped: 0,
        completed: 0,
        cancelled: 0,
      };
    }

    const calculated = {
      total: orders.length,
      pending: 0,
      processing: 0,
      shipped: 0,
      completed: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      if (calculated.hasOwnProperty(order.status)) {
        calculated[order.status as keyof typeof calculated]++;
      }
    });

    return calculated;
  }, [orders]);

  // Apply search filter
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      applyFilters({
        search: searchTerm || undefined,
        status: activeTab === "all" ? undefined : activeTab,
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, activeTab, applyFilters]);

  // const handleStatusUpdate = async (orderId: number, status: string, featureName: string) => {
  //   // Show coming soon modal instead of actual update
  //   setComingSoonFeature(featureName);
  //   setShowComingSoon(true);
    
  //   // Original code commented out for future use:
  //   // await updateOrderStatus(orderId, status);
  // };

  const handleTrackingUpdate = async (
    orderId: number,
    trackingNumber: string,
    courier: string
  ) => {
    await updateTracking(orderId, trackingNumber, courier);
    setSelectedOrder(null);
  };

  const handleViewDetail = (orderId: number) => {
    router.push(`/dashboard/orders/${orderId}`);
  };

  const OrderTable = ({ orders }: { orders: Order[] }) => {
    if (loading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="text-center py-8">
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold">Tidak ada pesanan</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm
              ? "Tidak ada pesanan yang sesuai dengan pencarian."
              : "Belum ada pesanan masuk."}
          </p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No. Pesanan</TableHead>
            <TableHead>Pelanggan</TableHead>
            <TableHead>Produk</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            // Get status config with fallback
            const statusInfo =
              statusConfig[order.status as keyof typeof statusConfig] ||
              defaultStatusConfig;
            const StatusIcon = statusInfo.icon;

            return (
              <TableRow key={order.id}>
                <TableCell>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    {order.order_number}
                  </code>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {order.customer?.name || "N/A"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {order.customer?.email || ""}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {order.items?.length || 0} produk
                    <div className="text-xs text-muted-foreground">
                      {order.items?.[0]?.product_name ||
                        "Produk tidak tersedia"}
                      {(order.items?.length || 0) > 1 &&
                        ` +${(order.items?.length || 0) - 1} lainnya`}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  Rp {order.total_amount.toLocaleString("id-ID")}
                </TableCell>
                <TableCell>
                  <Badge variant={statusInfo.variant}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(order.created_at).toLocaleDateString("id-ID")}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {/* Detail Button - Always shown */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetail(order.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Detail
                    </Button>
                    
                    {/* Status Update Buttons */}
                    {/* {order.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          handleStatusUpdate(order.id, "processing", "Update Status ke Diproses")
                        }
                      >
                        Proses
                      </Button>
                    )}
                    {order.status === "processing" && (
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setComingSoonFeature("Input Tracking & Pengiriman");
                          setShowComingSoon(true);
                        }}
                      >
                        Kirim
                      </Button>
                    )} */}
                    {order.status === "shipped" && order.tracking_number && (
                      <Badge variant="outline" className="text-xs">
                        {order.courier?.toUpperCase()} - {order.tracking_number}
                      </Badge>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button
            variant="outline"
            size="sm"
            onClick={refreshOrders}
            className="ml-2 bg-transparent"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Coba Lagi
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manajemen Pesanan
          </h1>
          <p className="text-muted-foreground">
            Kelola pesanan dan update status pengiriman
          </p>
        </div>
        <Button onClick={refreshOrders} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari pesanan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Orders Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="all">Semua ({stats.total})</TabsTrigger>
          <TabsTrigger value="pending">Menunggu ({stats.pending})</TabsTrigger>
          <TabsTrigger value="processing">
            Diproses ({stats.processing})
          </TabsTrigger>
          <TabsTrigger value="shipped">Dikirim ({stats.shipped})</TabsTrigger>
          <TabsTrigger value="completed">
            Selesai ({stats.completed})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Semua Pesanan</CardTitle>
              <CardDescription>
                Kelola semua pesanan dari satu tempat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrderTable orders={orders} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pesanan Menunggu Proses</CardTitle>
              <CardDescription>
                Pesanan yang perlu segera diproses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrderTable
                orders={orders.filter((o) => o.status === "pending")}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing">
          <Card>
            <CardHeader>
              <CardTitle>Pesanan Sedang Diproses</CardTitle>
              <CardDescription>
                Pesanan yang sedang disiapkan untuk pengiriman
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrderTable
                orders={orders.filter((o) => o.status === "processing")}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipped">
          <Card>
            <CardHeader>
              <CardTitle>Pesanan Sedang Dikirim</CardTitle>
              <CardDescription>
                Pesanan yang sudah dikirim dan dalam perjalanan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrderTable
                orders={orders.filter((o) => o.status === "shipped")}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Pesanan Selesai</CardTitle>
              <CardDescription>
                Pesanan yang sudah selesai dan diterima pelanggan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrderTable
                orders={orders.filter((o) => o.status === "completed")}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {pagination && pagination.total > pagination.per_page && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Menampilkan {pagination.from || 0} - {pagination.to || 0} dari{" "}
            {pagination.total} pesanan
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={
                !pagination.links.find((l) => l.label === "&laquo; Previous")
                  ?.url
              }
              onClick={() =>
                applyFilters({ ...filters, page: pagination.current_page - 1 })
              }
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={
                !pagination.links.find((l) => l.label === "Next &raquo;")?.url
              }
              onClick={() =>
                applyFilters({ ...filters, page: pagination.current_page + 1 })
              }
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}

      {/* Tracking Input Modal/Dialog */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-md w-full">
            <TrackingInput
              orderId={selectedOrder.id.toString()}
              orderNumber={selectedOrder.order_number}
              currentTrackingNumber={selectedOrder.tracking_number}
              currentCourier={selectedOrder.courier}
              onTrackingUpdate={async (orderId, trackingNumber, courier) => {
                await handleTrackingUpdate(
                  Number.parseInt(orderId),
                  trackingNumber,
                  courier
                );
              }}
            />
            <div className="p-4 border-t">
              <Button
                variant="outline"
                onClick={() => setSelectedOrder(null)}
                className="w-full"
              >
                Batal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
        feature={comingSoonFeature}
      />
    </div>
  );
}