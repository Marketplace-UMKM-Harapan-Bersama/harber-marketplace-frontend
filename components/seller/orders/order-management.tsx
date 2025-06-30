"use client";

import * as React from "react";
import {
  Clock,
  Package,
  Truck,
  CheckCircle,
  Search,
  Filter,
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
import { TrackingInput } from "../shipping/tracking-input";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  products: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "completed";
  createdAt: string;
  trackingNumber?: string;
  courier?: string;
}

interface OrderManagementProps {
  orders: Order[];
  onStatusUpdate: (orderId: string, status: string) => Promise<void>;
  onTrackingUpdate: (
    orderId: string,
    trackingNumber: string,
    courier: string
  ) => Promise<void>;
}

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
};

export function OrderManagement({
  orders,
  onStatusUpdate,
  onTrackingUpdate,
}: OrderManagementProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);

  const filterOrdersByStatus = (status?: string) => {
    let filtered = orders;

    if (status) {
      filtered = filtered.filter((order) => order.status === status);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const OrderTable = ({ orders }: { orders: Order[] }) => (
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
          const statusInfo = statusConfig[order.status];
          const StatusIcon = statusInfo.icon;

          return (
            <TableRow key={order.id}>
              <TableCell>
                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                  {order.orderNumber}
                </code>
              </TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>
                <div className="text-sm">
                  {order.products.length} produk
                  <div className="text-xs text-muted-foreground">
                    {order.products[0]?.name}
                    {order.products.length > 1 &&
                      ` +${order.products.length - 1} lainnya`}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                Rp {order.totalAmount.toLocaleString("id-ID")}
              </TableCell>
              <TableCell>
                <Badge variant={statusInfo.variant}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusInfo.label}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString("id-ID")}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {order.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => onStatusUpdate(order.id, "processing")}
                    >
                      Proses
                    </Button>
                  )}
                  {order.status === "processing" && (
                    <Button size="sm" onClick={() => setSelectedOrder(order)}>
                      Kirim
                    </Button>
                  )}
                  {order.status === "shipped" && order.trackingNumber && (
                    <Badge variant="outline" className="text-xs">
                      {order.courier?.toUpperCase()} - {order.trackingNumber}
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
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Semua ({orders.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Menunggu ({filterOrdersByStatus("pending").length})
          </TabsTrigger>
          <TabsTrigger value="processing">
            Diproses ({filterOrdersByStatus("processing").length})
          </TabsTrigger>
          <TabsTrigger value="shipped">
            Dikirim ({filterOrdersByStatus("shipped").length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Selesai ({filterOrdersByStatus("completed").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Semua Pesanan</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTable orders={filterOrdersByStatus()} />
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
              <OrderTable orders={filterOrdersByStatus("pending")} />
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
              <OrderTable orders={filterOrdersByStatus("processing")} />
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
              <OrderTable orders={filterOrdersByStatus("shipped")} />
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
              <OrderTable orders={filterOrdersByStatus("completed")} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tracking Input Modal/Dialog */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-md w-full">
            <TrackingInput
              orderId={selectedOrder.id}
              orderNumber={selectedOrder.orderNumber}
              currentTrackingNumber={selectedOrder.trackingNumber}
              currentCourier={selectedOrder.courier}
              onTrackingUpdate={async (orderId, trackingNumber, courier) => {
                await onTrackingUpdate(orderId, trackingNumber, courier);
                await onStatusUpdate(orderId, "shipped");
                setSelectedOrder(null);
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
    </div>
  );
}
