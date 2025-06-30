"use client"

import * as React from "react"
import { FolderSyncIcon as Sync } from "lucide-react"
import { Switch } from "@/components/ui/switch"
// import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

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
  lastSyncAt,
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
        {/* <Label htmlFor={`sync-${productId}`} className="text-sm font-medium">
          Sinkronisasi ke Marketplace
        </Label> */}
      </div>
      <div className="flex items-center space-x-2">
        {isSync && (
          <Badge variant="secondary" className="text-xs">
            <Sync className="w-3 h-3 mr-1" />
            Aktif
          </Badge>
        )}
        {lastSyncAt && (
          <span className="text-xs text-muted-foreground">
            Terakhir sync: {new Date(lastSyncAt).toLocaleString("id-ID")}
          </span>
        )}
      </div>
    </div>
  )
}
