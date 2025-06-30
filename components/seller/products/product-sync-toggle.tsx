"use client"

import * as React from "react"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"

interface ProductSyncToggleProps {
  productId: string
  productName: string
  isSync: boolean
  onSyncChange: (productId: string, isSync: boolean) => Promise<void>
  lastSyncAt?: string
}

export function ProductSyncToggle({
  productId,
  productName,
  isSync,
  onSyncChange,
  // lastSyncAt,
}: ProductSyncToggleProps) {
  const [loading, setLoading] = React.useState(false)

  const handleSyncToggle = async (checked: boolean) => {
    setLoading(true)
    try {
      await onSyncChange(productId, checked)
      toast.success(checked ? "Sinkronisasi Diaktifkan" : "Sinkronisasi Dinonaktifkan", {
        description: `Produk "${productName}" ${checked ? "akan" : "tidak akan"} disinkronkan ke marketplace.`,
      })
    } catch {
      toast.error("Gagal mengubah status sinkronisasi", {
        description: "Silakan coba lagi.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-between space-x-2">
      <div className="flex items-center space-x-2">
        <Switch id={`sync-${productId}`} checked={isSync} onCheckedChange={handleSyncToggle} disabled={loading} />
      </div>
    </div>
  )
}
