"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Copy,
  AlertCircle,
  RefreshCw,
  Hash,
  // Store,
  // User,
  // Truck,
  // Calendar,
  // Phone,
  // Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ordersApi } from "@/lib/orders/api";
import type { OrderDetail } from "@/lib/orders/types";
import { toast } from "sonner";

interface OrderDetailProps {
  params: Promise<{ id: string }>;
}

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "shipped":
      return "bg-purple-100 text-purple-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Helper function to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function OrderDetail({ params }: OrderDetailProps) {
  const router = useRouter();
  const [order, setOrder] = React.useState<OrderDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchOrder = React.useCallback(async (orderId: number) => {
    try {
      setLoading(true);
      setError(null);
      const orderData = await ordersApi.getOrder(orderId);
      setOrder(orderData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal memuat detail pesanan";
      setError(errorMessage);
      console.error("Error fetching order:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const loadOrder = async () => {
      try {
        const resolvedParams = await params;
        const orderId = Number.parseInt(resolvedParams.id);

        if (isNaN(orderId)) {
          setError("ID pesanan tidak valid");
          setLoading(false);
          return;
        }

        await fetchOrder(orderId);
      } catch (err) {
        console.log("Error resolving params:", err);
        setError("Gagal memuat parameter");
        setLoading(false);
      }
    };

    loadOrder();
  }, [params, fetchOrder]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Disalin ke clipboard");
  };

  const handleRetry = async () => {
    if (order?.id) {
      await fetchOrder(order.id);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error || "Pesanan tidak ditemukan"}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRetry}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Coba Lagi
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              Kembali
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  const orderItems = order.items || [];
  const totalAmount = Number.parseFloat(order.total_amount.toString()) || 0;
  const shippingCost = Number.parseFloat(order.shipping_cost.toString()) || 0;
  const fullAddress = `${order.shipping_address}, ${order.shipping_city}, ${order.shipping_province} ${order.shipping_postal_code}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Pesanan {order.order_number}</h1>
            <Badge className={getStatusColor(order.order_status)}>
              {order.order_status.toUpperCase()}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Dibuat pada {formatDate(order.created_at)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Order Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Informasi Pesanan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Order Number
              </span>
              <div className="flex items-center gap-2">
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {order.order_number}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => copyToClipboard(order.order_number)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Status Pesanan
              </span>
              <Badge className={getStatusColor(order.order_status)}>
                {order.order_status}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Status Pembayaran
              </span>
              <Badge className={getStatusColor(order.payment_status)}>
                {order.payment_status}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Metode Pembayaran
              </span>
              <span className="font-medium">{order.payment_method}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Dibuat
              </span>
              <span className="text-sm">{formatDate(order.created_at)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Diperbarui
              </span>
              <span className="text-sm">{formatDate(order.updated_at)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Ringkasan Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Subtotal
              </span>
              <span className="font-medium">
                Rp {(totalAmount - shippingCost).toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Ongkos Kirim
              </span>
              <span className="font-medium">
                Rp {shippingCost.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Total Items
              </span>
              <span className="font-medium">{orderItems.length} produk</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Total Quantity
              </span>
              <span className="font-medium">
                {orderItems.reduce((sum, item) => sum + item.quantity, 0)} pcs
              </span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total Pesanan</span>
                <span className="text-lg font-bold text-primary">
                  Rp {totalAmount.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Informasi Pengiriman
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Alamat Lengkap
              </label>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm whitespace-pre-line">{fullAddress}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Kota
                </label>
                <p className="text-sm font-medium">{order.shipping_city}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Provinsi
                </label>
                <p className="text-sm font-medium">{order.shipping_province}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Kode Pos
              </label>
              <p className="text-sm font-medium">{order.shipping_postal_code}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(fullAddress)}
                className="flex-1"
              >
                <Copy className="h-4 w-4 mr-2" />
                Salin Alamat
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="flex-1"
              >
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    fullAddress
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Lihat di Maps
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes (if available) */}
      {order.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Catatan Pesanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm whitespace-pre-line">{order.notes}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Item Pesanan ({orderItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orderItems.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produk</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-right">Harga Satuan</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item, index) => (
                    <TableRow key={`${item.product_id}-${index}`}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">
                            {item.product_name ||
                              item.product?.name ||
                              "Produk tidak dikenal"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Product ID: {item.product_id}
                          </p>
                          {item.product?.sku && (
                            <p className="text-xs text-muted-foreground">
                              SKU: {item.product.sku}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        Rp {item.price.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        Rp{" "}
                        {(item.price * item.quantity).toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Order Total Summary */}
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>
                        Rp{" "}
                        {orderItems
                          .reduce(
                            (sum, item) => sum + item.price * item.quantity,
                            0
                          )
                          .toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ongkos Kirim:</span>
                      <span>Rp {shippingCost.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>Rp {totalAmount.toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Tidak ada item dalam pesanan ini</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Daftar Pesanan
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => window.print()}>Print Detail</Button>
        </div>
      </div>
    </div>
  );
}