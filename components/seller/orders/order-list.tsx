"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Clock, Package, Truck, CheckCircle, Search, Eye, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  date: string
  status: "pending" | "processing" | "shipped" | "delivered" | "completed"
  total: number
  items: { product_name: string }[]
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
}

const dummyOrders: Order[] = [
  {
    id: "1",
    order_number: "ORD-000001",
    customer_name: "Ahmad Rizki",
    customer_email: "ahmad.rizki@email.com",
    date: "2024-01-15",
    status: "pending",
    total: 450000,
    items: [{ product_name: "Kemeja Batik Premium" }, { product_name: "Celana Jeans Slim Fit" }],
  },
  {
    id: "2",
    order_number: "ORD-000002",
    customer_name: "Siti Nurhaliza",
    customer_email: "siti.nur@email.com",
    date: "2024-01-14",
    status: "processing",
    total: 320000,
    items: [{ product_name: "Sepatu Sneakers Canvas" }],
  },
  {
    id: "3",
    order_number: "ORD-000003",
    customer_name: "Budi Santoso",
    customer_email: "budi.santoso@email.com",
    date: "2024-01-13",
    status: "shipped",
    total: 275000,
    items: [{ product_name: "Jaket Hoodie Cotton" }, { product_name: "Kaos Polos Premium" }],
  },
  {
    id: "4",
    order_number: "ORD-000004",
    customer_name: "Maya Sari",
    customer_email: "maya.sari@email.com",
    date: "2024-01-12",
    status: "delivered",
    total: 165000,
    items: [{ product_name: "Dompet Kulit Asli" }],
  },
  {
    id: "5",
    order_number: "ORD-000005",
    customer_name: "Dedi Kurniawan",
    customer_email: "dedi.kurnia@email.com",
    date: "2024-01-11",
    status: "completed",
    total: 380000,
    items: [{ product_name: "Jam Tangan Digital" }, { product_name: "Topi Baseball Cap" }],
  },
]

export function OrderList() {
  const router = useRouter()
  const [orders] = React.useState<Order[]>(dummyOrders)
  const [search, setSearch] = React.useState("")
  const [filteredOrders, setFilteredOrders] = React.useState<Order[]>(dummyOrders)

  React.useEffect(() => {
    if (search) {
      const filtered = orders.filter(
        (order) =>
          order.order_number.toLowerCase().includes(search.toLowerCase()) ||
          order.customer_name.toLowerCase().includes(search.toLowerCase()) ||
          order.customer_email.toLowerCase().includes(search.toLowerCase()) ||
          order.items.some((item) => item.product_name.toLowerCase().includes(search.toLowerCase())),
      )
      setFilteredOrders(filtered)
    } else {
      setFilteredOrders(orders)
    }
  }, [search, orders])

  const handleViewOrder = (orderId: string) => {
    router.push(`/dashboard/orders/${orderId}`)
  }

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    // In a real app, this would call an API
    console.log(`Updating order ${orderId} to status ${newStatus}`)
  }

  return (
    <div className="space-y-6">
      {/* Dummy Data Notice */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Mode Demo:</strong> Saat ini menggunakan data dummy karena backend produk belum siap. Semua produk dan
          pesanan yang ditampilkan adalah contoh data. <strong>Klik pada baris pesanan untuk melihat detail.</strong>
        </AlertDescription>
      </Alert>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Pesanan</h1>
          <p className="text-muted-foreground">Kelola pesanan dan update status pengiriman</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari pesanan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pesanan ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
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
              {filteredOrders.map((order) => {
                const statusInfo = statusConfig[order.status]
                const StatusIcon = statusInfo.icon

                return (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleViewOrder(order.id)}
                  >
                    <TableCell>
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">{order.order_number}</code>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customer_name}</div>
                        <div className="text-sm text-muted-foreground">{order.customer_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {order.items.length} produk
                        <div className="text-xs text-muted-foreground">
                          {order.items[0]?.product_name}
                          {order.items.length > 1 && ` +${order.items.length - 1} lainnya`}
                        </div>
                        <div className="text-xs text-blue-600 bg-blue-50 px-1 py-0.5 rounded mt-1 inline-block">
                          DUMMY
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>Rp {order.total.toLocaleString("id-ID")}</TableCell>
                    <TableCell>
                      <Badge variant={statusInfo.variant}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString("id-ID")}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                        <Button size="sm" variant="outline" onClick={() => handleViewOrder(order.id)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Detail
                        </Button>
                        {order.status === "pending" && (
                          <Button size="sm" onClick={() => handleStatusUpdate(order.id, "processing")}>
                            Proses
                          </Button>
                        )}
                        {order.status === "processing" && (
                          <Button size="sm" onClick={() => handleStatusUpdate(order.id, "shipped")}>
                            Kirim
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">Tidak ada pesanan</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {search ? "Tidak ada pesanan yang sesuai dengan pencarian." : "Belum ada pesanan masuk."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
