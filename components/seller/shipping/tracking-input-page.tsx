"use client"

import * as React from "react"
import { Package, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrackingInput } from "./tracking-input"
import type { Order } from "@/components/seller/dummy-data"

interface TrackingInputPageProps {
  orders: Order[]
  onTrackingUpdate: (orderId: string, trackingNumber: string, courier: string) => Promise<void>
}

export function TrackingInputPage({ orders, onTrackingUpdate }: TrackingInputPageProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filteredOrders, setFilteredOrders] = React.useState(orders)

  React.useEffect(() => {
    const filtered = orders.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredOrders(filtered)
  }, [orders, searchTerm])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Input Nomor Resi</h1>
          <p className="text-muted-foreground">Masukkan nomor resi untuk pesanan yang siap dikirim</p>
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
      </div>

      {/* Orders Ready to Ship */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Tidak ada pesanan yang siap dikirim</h3>
            <p className="text-muted-foreground text-center">
              Pesanan akan muncul di sini ketika statusnya sudah &quot;Sedang Diproses&quot; dan siap untuk dikirim.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Pesanan #{order.orderNumber}</span>
                  <div className="text-sm font-normal text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("id-ID")}
                  </div>
                </CardTitle>
                <CardDescription>
                  <div className="space-y-1">
                    <div>Pelanggan: {order.customerName}</div>
                    <div>Total: Rp {order.totalAmount.toLocaleString("id-ID")}</div>
                    <div>
                      Alamat: {order.shippingAddress.address}, {order.shippingAddress.city}
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TrackingInput
                  orderId={order.id}
                  orderNumber={order.orderNumber}
                  currentTrackingNumber={order.trackingNumber}
                  currentCourier={order.courier}
                  onTrackingUpdate={onTrackingUpdate}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
