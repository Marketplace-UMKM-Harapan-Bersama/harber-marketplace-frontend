"use client";

import * as React from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Package, Truck, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { UserButton } from "@/components/auth/user-button";
import { CartSheet } from "@/components/cart-sheet";
import { Footer } from "@/components/layout/footer";
import { useOrders } from "@/hooks/use-queries";
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

function OrderSkeleton() {
  return (
    <div className="p-6 border rounded-lg space-y-4 bg-background">
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-8 w-32 rounded-full" />
      </div>
      <div className="pb-4">
        <Skeleton className="h-5 w-40" />
      </div>
      <div className="space-y-4">
        <div className="flex gap-4">
          <Skeleton className="w-16 h-16 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
      <div className="pt-4 border-t">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>
      <div className="pt-4 flex justify-end gap-2">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = React.useState("all");
  const { data: ordersResponse, isLoading } = useOrders();

  const filteredOrders = React.useMemo(() => {
    if (!ordersResponse) return [];
    if (activeTab === "all") return ordersResponse.data;
    return ordersResponse.data.filter(
      (order) => order.order_status === activeTab
    );
  }, [activeTab, ordersResponse]);

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
    <main className="grid grid-cols-1 gap-8 py-8 px-5 md:px-10 h-screen overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant={"outline"} size={"icon"} asChild>
            <Link href={"/"}>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-medium font-mono">Pesanan Saya</h1>
        </div>
        <div className="flex items-center gap-2">
          <CartSheet />
          <UserButton />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto sticky top-16 z-10">
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="pending">Menunggu diproses</TabsTrigger>
          <TabsTrigger value="processing">Sedang diproses</TabsTrigger>
          <TabsTrigger value="shipped">Sedang dikirim</TabsTrigger>
          <TabsTrigger value="delivered">Diterima</TabsTrigger>
          <TabsTrigger value="completed">Selesai</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {isLoading ? (
              // Show skeletons while loading
              Array.from({ length: 3 }).map((_, i) => <OrderSkeleton key={i} />)
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Tidak ada pesanan
              </div>
            ) : (
              filteredOrders.map((order) => {
                const status =
                  STATUS_MAP[order.order_status as keyof typeof STATUS_MAP];
                const StatusIcon = status.icon;

                return (
                  <div
                    key={order.id}
                    className="p-6 border rounded-lg space-y-4 bg-background"
                  >
                    {/* Order Header */}
                    <div className="flex items-center justify-between pb-4 border-b">
                      <div>
                        <p className="text-lg font-medium">
                          {order.order_number}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.created_at)}
                        </p>

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
                        <p className="text-sm text-muted-foreground">
                          Status Pembayaran:{" "}
                          <span className="font-medium text-primary">
                            {order.payment_status === "paid"
                              ? "Lunas"
                              : "Belum Lunas"}
                          </span>
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

                    {/* Order Total */}
                    <div className="pt-4 ">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                          Total Pesanan
                        </span>

                        <span className="font-medium">
                          {formatPrice(
                            parseFloat(order.total_amount) +
                              parseFloat(order.shipping_cost)
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex justify-end gap-2">
                      <Button variant="outline" asChild>
                        <Link href={`/orders/${order.id}`}>Detail Pesanan</Link>
                      </Button>
                      {order.order_status === "delivered" && (
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
