"use client"

import * as React from "react"
import { Truck, Save, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface TrackingInputProps {
  orderId: string
  orderNumber: string
  currentTrackingNumber?: string
  currentCourier?: string
  onTrackingUpdate: (orderId: string, trackingNumber: string, courier: string) => Promise<void>
}

const couriers = [
  { value: "jne", label: "JNE" },
  { value: "pos", label: "Pos Indonesia" },
  { value: "tiki", label: "TIKI" },
  { value: "jnt", label: "J&T Express" },
  { value: "sicepat", label: "SiCepat" },
  { value: "anteraja", label: "AnterAja" },
  { value: "ninja", label: "Ninja Express" },
]

export function TrackingInput({
  orderId,
  orderNumber,
  currentTrackingNumber = "",
  currentCourier = "",
  onTrackingUpdate,
}: TrackingInputProps) {
  const [trackingNumber, setTrackingNumber] = React.useState(currentTrackingNumber)
  const [courier, setCourier] = React.useState(currentCourier)
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!trackingNumber.trim() || !courier) {
      toast.error("Data tidak lengkap", {
        description: "Nomor resi dan kurir harus diisi.",
      })
      return
    }

    setLoading(true)
    try {
      await onTrackingUpdate(orderId, trackingNumber.trim(), courier)
      toast.success("Nomor resi berhasil disimpan", {
        description: "Data telah disinkronkan ke marketplace.",
      })
    } catch {
      toast.error("Gagal menyimpan nomor resi", {
        description: "Silakan coba lagi.",
      })
    } finally {
      setLoading(false)
    }
  }

  const getTrackingUrl = (courier: string, trackingNumber: string) => {
    const urls: Record<string, string> = {
      jne: `https://www.jne.co.id/id/tracking/trace/${trackingNumber}`,
      pos: `https://www.posindonesia.co.id/id/tracking/${trackingNumber}`,
      tiki: `https://www.tiki.id/id/tracking?awb=${trackingNumber}`,
      jnt: `https://www.jet.co.id/track/${trackingNumber}`,
      sicepat: `https://www.sicepat.com/checkAwb/${trackingNumber}`,
      anteraja: `https://www.anteraja.id/tracking?receipt=${trackingNumber}`,
      ninja: `https://www.ninjaxpress.co/id-id/tracking?query=${trackingNumber}`,
    }
    return urls[courier] || "#"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Truck className="w-5 h-5" />
          <span>Input Nomor Resi</span>
        </CardTitle>
        <CardDescription>Pesanan #{orderNumber}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="courier">Kurir Pengiriman</Label>
            <Select value={courier} onValueChange={setCourier}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kurir pengiriman" />
              </SelectTrigger>
              <SelectContent>
                {couriers.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tracking-number">Nomor Resi</Label>
            <Input
              id="tracking-number"
              type="text"
              placeholder="Masukkan nomor resi pengiriman"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="font-mono"
            />
          </div>

          <div className="flex items-center justify-between">
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Menyimpan..." : "Simpan Resi"}
            </Button>

            {currentTrackingNumber && currentCourier && (
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {couriers.find((c) => c.value === currentCourier)?.label} - {currentTrackingNumber}
                </Badge>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(getTrackingUrl(currentCourier, currentTrackingNumber), "_blank")}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
