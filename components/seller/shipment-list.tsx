"use client"

import * as React from "react"
import { Truck, Search, Filter, ExternalLink, Package, Clock, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Shipment } from "@/lib/dummy-data"

interface ShipmentListProps {
  shipments: Shipment[]
}

const statusConfig = {
  pending: { label: "Menunggu Pickup", icon: Clock, variant: "secondary" as const },
  picked_up: { label: "Sudah Dipickup", icon: Package, variant: "default" as const },
  in_transit: { label: "Dalam Perjalanan", icon: Truck, variant: "default" as const },
  delivered: { label: "Terkirim", icon: CheckCircle, variant: "default" as const },
}

const courierLabels: Record<string, string> = {
  jne: "JNE",
  pos: "Pos Indonesia",
  tiki: "TIKI",
  jnt: "J&T Express",
  sicepat: "SiCepat",
  anteraja: "AnterAja",
  ninja: "Ninja Express",
}

export function ShipmentList({ shipments }: ShipmentListProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filteredShipments, setFilteredShipments] = React.useState(shipments)

  React.useEffect(() => {
    const filtered = shipments.filter(
      (shipment) =>
        shipment.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredShipments(filtered)
  }, [shipments, searchTerm])

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daftar Pengiriman</h1>
          <p className="text-muted-foreground">Pantau status pengiriman pesanan Anda</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari pengiriman..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Shipments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Truck className="w-5 h-5" />
            <span>Daftar Pengiriman ({filteredShipments.length})</span>
          </CardTitle>
          <CardDescription>Status pengiriman pesanan dari toko Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Pesanan</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Alamat Tujuan</TableHead>
                <TableHead>Kurir</TableHead>
                <TableHead>No. Resi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Estimasi Tiba</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShipments.map((shipment) => {
                const statusInfo = statusConfig[shipment.status]
                const StatusIcon = statusInfo.icon

                return (
                  <TableRow key={shipment.id}>
                    <TableCell>
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">{shipment.orderNumber}</code>
                    </TableCell>
                    <TableCell>{shipment.customerName}</TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate text-sm">{shipment.shippingAddress}</div>
                    </TableCell>
                    <TableCell>
                      {shipment.courier ? (
                        <Badge variant="outline">
                          {courierLabels[shipment.courier] || shipment.courier.toUpperCase()}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {shipment.trackingNumber ? (
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">{shipment.trackingNumber}</code>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusInfo.variant}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {shipment.estimatedDelivery ? (
                        <span className="text-sm">
                          {new Date(shipment.estimatedDelivery).toLocaleDateString("id-ID")}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {shipment.trackingNumber && shipment.courier && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(getTrackingUrl(shipment.courier!, shipment.trackingNumber!), "_blank")
                          }
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Lacak
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
