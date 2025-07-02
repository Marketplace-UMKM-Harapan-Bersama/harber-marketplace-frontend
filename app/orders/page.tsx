"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Package, Truck, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { UserButton } from "@/components/auth/user-button";
import { CartSheet } from "@/components/cart-sheet";
import { Footer } from "@/components/layout/footer";

// Dummy order data
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
        image_url:
          "https://res.cloudinary.com/dyacollection/image/upload/v1750585927/t-shirt-spiral-1_kz6pte.png",
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
        image_url:
          "https://res.cloudinary.com/dyacollection/image/upload/v1750585927/t-shirt-spiral-1_kz6pte.png",
      },
    ],
  },
  {
    id: 3,
    order_number: "ORD-003",
    created_at: "2024-03-18T09:15:00Z",
    status: "shipped",
    total_amount: 500000,
    shipping_cost: 25000,
    payment_method: "bank_transfer",
    shipping_address: "Jl. Melati",
    shipping_city: "Surabaya",
    shipping_province: "Jawa Timur",
    shipping_postal_code: "60111",
    seller: {
      id: 5,
      shop_name: "Toko C",
    },
    items: [
      {
        id: 3,
        product_id: 7,
        name: "Celana Jeans",
        price: 250000,
        quantity: 2,
        image_url:
          "https://res.cloudinary.com/dyacollection/image/upload/v1750585927/t-shirt-spiral-1_kz6pte.png",
      },
    ],
  },
  {
    id: 4,
    order_number: "ORD-004",
    created_at: "2024-03-17T14:20:00Z",
    status: "delivered",
    total_amount: 180000,
    shipping_cost: 18000,
    payment_method: "cod",
    shipping_address: "Jl. Anggrek",
    shipping_city: "Yogyakarta",
    shipping_province: "DI Yogyakarta",
    shipping_postal_code: "55111",
    seller: {
      id: 6,
      shop_name: "Toko D",
    },
    items: [
      {
        id: 4,
        product_id: 8,
        name: "Kaos Polo",
        price: 90000,
        quantity: 2,
        image_url:
          "https://res.cloudinary.com/dyacollection/image/upload/v1750585927/t-shirt-spiral-1_kz6pte.png",
      },
    ],
  },
  {
    id: 5,
    order_number: "ORD-005",
    created_at: "2024-03-16T11:45:00Z",
    status: "completed",
    total_amount: 425000,
    shipping_cost: 25000,
    payment_method: "bank_transfer",
    shipping_address: "Jl. Dahlia",
    shipping_city: "Medan",
    shipping_province: "Sumatera Utara",
    shipping_postal_code: "20111",
    seller: {
      id: 7,
      shop_name: "Toko E",
    },
    items: [
      {
        id: 5,
        product_id: 9,
        name: "Jaket Denim",
        price: 400000,
        quantity: 1,
        image_url:
          "https://res.cloudinary.com/dyacollection/image/upload/v1750585927/t-shirt-spiral-1_kz6pte.png",
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

export default function OrdersPage() {
  const [activeTab, setActiveTab] = React.useState("all");

  const filteredOrders = React.useMemo(() => {
    if (activeTab === "all") return DUMMY_ORDERS;
    return DUMMY_ORDERS.filter((order) => order.status === activeTab);
  }, [activeTab]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <main className=" grid grid-cols-1 gap-8 py-8 px-5 md:px-10 h-screen overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant={"outline"} size={"icon"} asChild>
            <Link href={"/"}>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-medium font-mono ">Pesanan Saya</h1>
        </div>
        <div className="flex items-center gap-2">
          <CartSheet />
          <UserButton />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto sticky top-16 z-10 ">
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="pending">Menunggu diproses</TabsTrigger>
          <TabsTrigger value="processing">Sedang diproses</TabsTrigger>
          <TabsTrigger value="shipped">Sedang dikirim</TabsTrigger>
          <TabsTrigger value="delivered">Diterima</TabsTrigger>
          <TabsTrigger value="completed">Selesai</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Tidak ada pesanan
              </div>
            ) : (
              filteredOrders.map((order) => {
                const status =
                  STATUS_MAP[order.status as keyof typeof STATUS_MAP];
                const StatusIcon = status.icon;

                return (
                  <div
                    key={order.id}
                    className="p-6 border rounded-lg space-y-4 bg-background"
                  >
                    {/* Order Header */}
                    <div className="flex items-center justify-between pb-4 border-b">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {order.order_number}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full flex items-center gap-2 ${status.bgColor}`}
                      >
                        <StatusIcon className={`w-4 h-4 ${status.color}`} />
                        <span className={`text-sm font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>

                    {/* Seller Info */}
                    <div className="pb-4">
                      <h3 className="font-medium">{order.seller.shop_name}</h3>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="relative w-16 h-16 border rounded-md overflow-hidden">
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
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Total */}
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Total Pesanan
                        </span>
                        <span className="font-medium">
                          {formatPrice(
                            order.total_amount + order.shipping_cost
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex justify-end gap-2">
                      <Button variant="outline" asChild>
                        <Link href={`/orders/${order.id}`}>Detail Pesanan</Link>
                      </Button>
                      {order.status === "delivered" && (
                        <Button
                          onClick={() => alert("Implement order completion")}
                        >
                          Selesaikan Pesanan
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
      <Footer />
    </main>
  );
}
