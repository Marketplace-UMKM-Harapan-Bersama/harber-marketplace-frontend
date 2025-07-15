"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatPrice, getProductImageUrl } from "@/lib/utils";
import { Package, Truck, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { useOrder } from "@/hooks/use-queries";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_MAP = {
  pending: {
    label: "Menunggu diproses",
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  processing: {
    label: "Sedang diproses",
    icon: Package,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  shipped: {
    label: "Sedang dikirim",
    icon: Truck,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  delivered: {
    label: "Diterima oleh customer",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  completed: {
    label: "Selesai",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
};

function OrderDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {/* Order Status */}
        <div className="p-6 border rounded-lg bg-background">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-10 w-40 rounded-full" />
          </div>
        </div>

        {/* Shipping Info */}
        <div className="p-6 border rounded-lg bg-background space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* Payment Info */}
        <div className="p-6 border rounded-lg bg-background space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Order Summary */}
      <div className="space-y-8">
        {/* Products */}
        <div className="p-6 border rounded-lg bg-background space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="w-20 h-20 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <div className="p-6 border rounded-lg bg-background space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex justify-between pt-2 border-t">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = Number(params.id);
  const { data: orderResponse, isLoading } = useOrder(orderId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <main className="py-8 px-5 md:px-10">
        <div className="flex items-center gap-4 mb-8">
          <Button variant={"outline"} size={"icon"} asChild>
            <Link href="/orders">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-medium font-mono">Detail Pesanan</h1>
        </div>
        <OrderDetailSkeleton />
      </main>
    );
  }

  if (!orderResponse) {
    return (
      <main className="py-8 px-5 md:px-10">
        <div className="flex items-center gap-4 mb-8">
          <Button variant={"outline"} size={"icon"} asChild>
            <Link href="/orders">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-medium font-mono">Detail Pesanan</h1>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          Pesanan tidak ditemukan
        </div>
      </main>
    );
  }

  const order = orderResponse.data;
  const status = STATUS_MAP[order.order_status as keyof typeof STATUS_MAP];
  const StatusIcon = status.icon;

  return (
    <main className="py-8 px-5 md:px-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant={"outline"} size={"icon"} asChild>
          <Link href="/orders">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-medium font-mono">Detail Pesanan</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Status */}
          <div className="p-6 border rounded-lg bg-background">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium">{order.order_number}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(order.created_at)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Status Pembayaran:{" "}
                  <span className="font-medium text-primary">
                    {order.payment_status === "paid" ? "Lunas" : "Belum Lunas"}
                  </span>
                </p>
              </div>
              <div
                className={`px-4 py-2 rounded-full flex items-center gap-2 ${status.bgColor}`}
              >
                <StatusIcon className={`w-5 h-5 ${status.color}`} />
                <span className={`text-sm font-medium ${status.color}`}>
                  {status.label}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="p-6 border rounded-lg bg-background">
            <h2 className="text-lg font-medium mb-4">Alamat Pengiriman</h2>
            <div className="space-y-2">
              <p>{order.shipping_address}</p>
              <p>
                {order.shipping_city}, {order.shipping_province}
              </p>
              <p>{order.shipping_postal_code}</p>

              <p className="text-sm text-muted-foreground">
                {order.shipping_address}, {order.shipping_city}
                <span className="text-muted-foreground">, </span>
                <span className="text-muted-foreground">
                  {order.shipping_postal_code}
                </span>
                <span className="text-muted-foreground">, </span>
                <span className="text-muted-foreground">
                  {order.shipping_province}
                </span>
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="p-6 border rounded-lg bg-background">
            <h2 className="text-lg font-medium mb-4">Informasi Pembayaran</h2>
            <p className="capitalize">
              {order.payment_method
                ? order.payment_method.replace("_", " ")
                : "-"}
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-8">
          {/* Products */}
          <div className="p-6 border rounded-lg bg-background">
            <h2 className="text-lg font-medium mb-4">Produk</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-20 h-20 border rounded-md overflow-hidden">
                    <Image
                      src={getProductImageUrl(
                        item.product.image_url,
                        item.product.seller
                      )}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} x {formatPrice(item.price)}
                    </p>
                    <p className="font-medium mt-1">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="p-6 border rounded-lg bg-background">
            <h2 className="text-lg font-medium mb-4">Ringkasan Pembayaran</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Harga</span>
                <span>{formatPrice(parseFloat(order.total_amount))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Biaya Pengiriman</span>
                <span>{formatPrice(parseFloat(order.shipping_cost))}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium">Total Pembayaran</span>
                <span className="font-medium">
                  {formatPrice(
                    parseFloat(order.total_amount) +
                      parseFloat(order.shipping_cost)
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {order.order_status === "delivered" && (
            <Button
              className="w-full"
              onClick={() => alert("Implement order completion")}
            >
              Selesaikan Pesanan
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
