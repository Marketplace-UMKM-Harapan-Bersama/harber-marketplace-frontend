"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  // Package,
  // FolderOpen,
  ShoppingCart,
  Truck,
  BarChart3,
  ChevronDown,
  User,
  LogOut,
  Store,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "next-themes";

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
    // {
    //   title: "Produk",
    //   url: "/dashboard/products",
    //   icon: Package,
    // },
    // {
    //   title: "Kategori",
    //   url: "/dashboard/categories",
    //   icon: FolderOpen,
    // },
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
  const { user, logout } = useAuth();
  const { setTheme, theme } = useTheme();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-transparent active:bg-transparent  border-b-2 border-primary w-fit">
              <Image
                src="/web-app-manifest-192x192.png"
                alt="Logo"
                width={24}
                height={24}
                className="rounded-sm"
              />
              <span className="text-base font-semibold ">
                Harber Marketplace
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => {
              const isActive =
                item.url === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === item.url ||
                    pathname.startsWith(item.url + "/");

              // Jika item memiliki sub-items (dropdown) - hanya untuk Pengiriman
              if (item.items) {
                return (
                  <Collapsible key={item.title} asChild defaultOpen={isActive}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={isActive}
                        >
                          <item.icon />
                          <span>{item.title}</span>
                          <ChevronDown />
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
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Store />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user?.name}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="right"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="flex flex-col gap-1 py-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium truncate">
                      {user?.name || "Loading..."}
                    </span>
                  </div>
                  <span className="text-muted-foreground truncate pl-6">
                    {user?.email || "Loading..."}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Theme</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                  <DropdownMenuRadioItem value="system">
                    System
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="light">
                    Light
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">
                    Dark
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2" onClick={logout}>
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
