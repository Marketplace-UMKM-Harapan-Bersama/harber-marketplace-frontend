"use client"

import { AppSidebar } from "@/components/seller/app-sider"
import { TrackingInputPage } from "@/components/seller/shipping/tracking-input-page"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { dummyOrders } from "@/components/seller/dummy-data"

export default function TrackingPage() {
  const handleTrackingUpdate = async (orderId: string, trackingNumber: string, courier: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In real implementation, this would call the API
    console.log(`Order ${orderId} tracking updated: ${courier} - ${trackingNumber}`)
  }

  // Filter orders that are ready to ship (processing status)
  const ordersReadyToShip = dummyOrders.filter((order) => order.status === "processing")

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/seller/shipping">Pengiriman</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Isi Resi</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <TrackingInputPage orders={ordersReadyToShip} onTrackingUpdate={handleTrackingUpdate} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
