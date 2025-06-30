"use client"

import * as React from "react"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

interface CategorySyncToggleProps {
  categoryId: string
  categoryName: string
  isSync: boolean
  onSyncChange: (categoryId: string, isSync: boolean) => Promise<void>
  lastSyncAt?: string
}

export function CategorySyncToggle({
  categoryId,
  categoryName,
  isSync,
  onSyncChange,
  lastSyncAt,
}: CategorySyncToggleProps) {
  const [loading, setLoading] = React.useState(false)

  const handleSyncToggle = async (checked: boolean) => {
    setLoading(true)
    try {
      await onSyncChange(categoryId, checked)
      toast.success(checked ? "Sinkronisasi Diaktifkan" : "Sinkronisasi Dinonaktifkan", {
        description: `Kategori "${categoryName}" ${checked ? "akan" : "tidak akan"} disinkronkan ke marketplace.`,
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
        <Switch id={`sync-${categoryId}`} checked={isSync} onCheckedChange={handleSyncToggle} disabled={loading} />
      </div>
      <div className="flex items-center space-x-2">
        {lastSyncAt && (
          <span className="text-xs text-muted-foreground">{new Date(lastSyncAt).toLocaleDateString("id-ID")}</span>
        )}
      </div>
    </div>
  )
}
