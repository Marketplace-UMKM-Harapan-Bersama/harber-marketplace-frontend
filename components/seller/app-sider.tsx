"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  FolderOpen,
  ShoppingCart,
  Truck,
  BarChart3,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Store,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const data = {
  user: {
    name: "Toko Berkah Jaya",
    email: "berkah@example.com",
  },
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: BarChart3,
    },
    {
      title: "Produk",
      url: "/dashboard/products",
      icon: Package,
    },
    {
      title: "Kategori",
      url: "/dashboard/categories",
      icon: FolderOpen,
    },
    {
      title: "Pesanan",
      url: "/dashboard/orders",
      icon: ShoppingCart,
    },
    {
      title: "Pengiriman",
      url: "/dashboard/shipping",
      icon: Truck,
      items: [
        {
          title: "Daftar Pengiriman",
          url: "/dashboard/shipping",
        },
        {
          title: "Isi Resi",
          url: "/dashboard/shipping/tracking",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader></SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {data.navMain.map((item) => {
            const isActive =
              pathname === item.url || pathname.startsWith(item.url + "/");

            // Jika item memiliki sub-items (dropdown) - hanya untuk Pengiriman
            if (item.items) {
              return (
                <Collapsible key={item.title} asChild defaultOpen={isActive}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title} isActive={isActive}>
                        <item.icon />
                        <span>{item.title}</span>
                        <ChevronDown className="ml-auto size-4" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            }

            // Menu biasa tanpa dropdown - langsung klik ke URL
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Store className="h-4 w-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {data.user.name}
                    </span>
                    <span className="truncate text-xs">{data.user.email}</span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuItem className="gap-2">
                  <User className="size-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Settings className="size-4" />
                  <span>Pengaturan</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2">
                  <LogOut className="size-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}