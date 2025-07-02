"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Package, Truck, Clock, CheckCircle, ArrowLeft } from "lucide-react";

// Reuse dummy data and status map from orders page
const DUMMY_ORDERS = [
  {
    id: 1,
    order_number: "ORD-001",
    created_at: "2024-03-20T10:00:00Z",
    status: "pending",
    total_amount: 275000,
    shipping_cost: 15000,
    payment_method: "bank_transfer",
    shipping_address: "Jl. Mangga",
    shipping_city: "Bandung",
    shipping_province: "Jawa Barat",
    shipping_postal_code: "40123",
    seller: {
      id: 3,
      shop_name: "Toko A",
    },
    items: [
      {
        id: 1,
        product_id: 5,
        name: "T-Shirt Hitam",
        price: 75000,
        quantity: 1,
        image_url: "https://picsum.photos/200",
      },
    ],
  },
  {
    id: 2,
    order_number: "ORD-002",
    created_at: "2024-03-19T15:30:00Z",
    status: "processing",
    total_amount: 350000,
    shipping_cost: 20000,
    payment_method: "bank_transfer",
    shipping_address: "Jl. Kenanga",
    shipping_city: "Jakarta",
    shipping_province: "DKI Jakarta",
    shipping_postal_code: "10110",
    seller: {
      id: 4,
      shop_name: "Toko B",
    },
    items: [
      {
        id: 2,
        product_id: 6,
        name: "Kemeja Putih",
        price: 150000,
        quantity: 2,
        image_url: "https://picsum.photos/201",
      },
    ],
  },
];

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

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = Number(params.id);

  // Find order from dummy data
  const order = DUMMY_ORDERS.find((o) => o.id === orderId);

  if (!order) {
    return (
      <main className=" py-8 px-5 md:px-10">
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

  const status = STATUS_MAP[order.status as keyof typeof STATUS_MAP];
  const StatusIcon = status.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className=" py-8 px-5 md:px-10">
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

          {/* Seller Info */}
          <div className="p-6 border rounded-lg bg-background">
            <h2 className="text-lg font-medium mb-4">Informasi Penjual</h2>
            <p>{order.seller.shop_name}</p>
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
            </div>
          </div>

          {/* Payment Info */}
          <div className="p-6 border rounded-lg bg-background">
            <h2 className="text-lg font-medium mb-4">Informasi Pembayaran</h2>
            <p className="capitalize">
              {order.payment_method.replace("_", " ")}
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
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
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
                <span>{formatPrice(order.total_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Biaya Pengiriman</span>
                <span>{formatPrice(order.shipping_cost)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium">Total Pembayaran</span>
                <span className="font-medium">
                  {formatPrice(order.total_amount + order.shipping_cost)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {order.status === "delivered" && (
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
