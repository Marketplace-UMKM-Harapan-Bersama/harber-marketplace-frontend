"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Package, Truck, CheckCircle } from "lucide-react"
import { toast } from "sonner"

interface Order {
  id: string
  orderNumber: string
  status: "pending" | "processing" | "shipped" | "delivered" | "completed"
}

interface OrderActionsProps {
  order: Order
  onStatusUpdate: (orderId: string, status: string) => Promise<void>
}

const statusConfig = {
  pending: { label: "Menunggu Proses", icon: Clock, variant: "secondary" as const },
  processing: { label: "Sedang Diproses", icon: Package, variant: "default" as const },
  shipped: { label: "Sedang Dikirim", icon: Truck, variant: "default" as const },
  delivered: { label: "Diterima", icon: CheckCircle, variant: "default" as const },
  completed: { label: "Selesai", icon: CheckCircle, variant: "default" as const },
}

export function OrderActions({ order, onStatusUpdate }: OrderActionsProps) {
  const [loading, setLoading] = React.useState(false)

  const handleStatusUpdate = async (newStatus: string) => {
    setLoading(true)
    try {
      await onStatusUpdate(order.id, newStatus)

      const statusMessages = {
        processing: "Pesanan mulai diproses",
        shipped: "Pesanan telah dikirim",
        delivered: "Pesanan telah diterima",
        completed: "Pesanan telah selesai",
      }

      toast.success("Status pesanan diperbarui", {
        description: `${statusMessages[newStatus as keyof typeof statusMessages]} - #${order.orderNumber}`,
      })
    } catch {
      toast.error("Gagal memperbarui status", {
        description: "Silakan coba lagi.",
      })
    } finally {
      setLoading(false)
    }
  }

  const statusInfo = statusConfig[order.status]
  const StatusIcon = statusInfo.icon

  return (
    <div className="flex items-center space-x-2">
      <Badge variant={statusInfo.variant}>
        <StatusIcon className="w-3 h-3 mr-1" />
        {statusInfo.label}
      </Badge>

      {order.status === "pending" && (
        <Button size="sm" onClick={() => handleStatusUpdate("processing")} disabled={loading}>
          {loading ? "Memproses..." : "Proses"}
        </Button>
      )}

      {order.status === "processing" && (
        <Button size="sm" onClick={() => handleStatusUpdate("shipped")} disabled={loading}>
          {loading ? "Mengirim..." : "Kirim"}
        </Button>
      )}

      {order.status === "shipped" && (
        <Button size="sm" variant="outline" onClick={() => handleStatusUpdate("delivered")} disabled={loading}>
          {loading ? "Mengonfirmasi..." : "Konfirmasi Diterima"}
        </Button>
      )}
    </div>
  )
}
