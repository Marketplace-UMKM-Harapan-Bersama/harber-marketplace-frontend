"use client"

import { AppSidebar } from "@/components/seller/app-sider"
import { CategoryList } from "@/components/seller/categories/category-list"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { dummyCategories } from "@/components/seller/dummy-data"

export default function CategoriesPage() {
  const handleSyncChange = async (categoryId: string, isSync: boolean) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In real implementation, this would call the API
    console.log(`Category ${categoryId} sync changed to ${isSync}`)
  }

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
                  <BreadcrumbPage>Kategori</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <CategoryList categories={dummyCategories} onSyncChange={handleSyncChange} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
