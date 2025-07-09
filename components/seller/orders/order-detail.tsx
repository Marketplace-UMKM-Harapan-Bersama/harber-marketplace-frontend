"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Package, MapPin, CreditCard, Copy, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ordersApi } from "@/lib/orders/api"
import type { OrderDetail } from "@/lib/orders/types"
import { toast } from "sonner"

interface OrderDetailProps {
  params: Promise<{ id: string }>
}

export function OrderDetail({ params }: OrderDetailProps) {
  const router = useRouter()
  const [order, setOrder] = React.useState<OrderDetail | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const fetchOrder = React.useCallback(async (orderId: number) => {
    try {
      setLoading(true)
      setError(null)
      const orderData = await ordersApi.getOrder(orderId)
      setOrder(orderData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Gagal memuat detail pesanan"
      setError(errorMessage)
      console.error("Error fetching order:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    const loadOrder = async () => {
      try {
        const resolvedParams = await params
        const orderId = Number.parseInt(resolvedParams.id)

        if (isNaN(orderId)) {
          setError("ID pesanan tidak valid")
          setLoading(false)
          return
        }

        await fetchOrder(orderId)
      } catch (err) {
        console.log("Error resolving params:", err)
        setError("Gagal memuat parameter")
        setLoading(false)
      }
    }

    loadOrder()
  }, [params, fetchOrder])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Disalin ke clipboard")
  }

  const handleRetry = async () => {
    if (order?.id) {
      await fetchOrder(order.id)
    }
  }

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
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-96" />
      </div>
    )
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
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Pesanan #{order.id}</h1>
            <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">DUMMY DATA</div>
          </div>
          <p className="text-muted-foreground">Detail pesanan untuk order ID {order.id}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Ringkasan Pesanan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Order ID</span>
              <div className="flex items-center gap-2">
                <code className="text-sm bg-muted px-2 py-1 rounded">#{order.id}</code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => copyToClipboard(order.id.toString())}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Total Items</span>
              <span className="font-medium">{order.order_items.length} produk</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Total Quantity</span>
              <span className="font-medium">{order.order_items.reduce((sum, item) => sum + item.quantity, 0)} pcs</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total Pesanan</span>
                <span className="text-lg font-bold text-primary">Rp {order.total.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Alamat Pengiriman
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium whitespace-pre-line">{order.shipping_address}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(order.shipping_address)}
                className="flex-1"
              >
                <Copy className="h-4 w-4 mr-2" />
                Salin Alamat
              </Button>
              <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.shipping_address)}`}
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

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Item Pesanan ({order.order_items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
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
              {order.order_items.map((item, index) => (
                <TableRow key={`${item.product_id}-${index}`}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-muted-foreground">Product ID: {item.product_id}</p>
                      <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mt-1 inline-block">
                        DUMMY PRODUCT
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">{item.quantity}</TableCell>
                  <TableCell className="text-right">Rp {item.price.toLocaleString("id-ID")}</TableCell>
                  <TableCell className="text-right font-medium">
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
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
                    {order.order_items
                      .reduce((sum, item) => sum + item.price * item.quantity, 0)
                      .toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>Rp {order.total.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
          </div>
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
  )
}
