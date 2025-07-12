"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ShoppingCart,
  BarChart3,
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

import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "next-themes";

// Sidebar navigation items
const data = {
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: BarChart3,
    },
    {
      title: "Pesanan",
      url: "/dashboard/orders",
      icon: ShoppingCart,
    },
    // Add more items if needed...
  ],
};

export function AppSidebar(props: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { setTheme, theme } = useTheme();

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-transparent active:bg-transparent border-b-2 border-primary w-fit">
              <Image
                src="/web-app-manifest-192x192.png"
                alt="Logo"
                width={24}
                height={24}
                className="rounded-sm"
              />
              <span className="text-base font-semibold">Harber Marketplace</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <hr className="mt-5 mb-5" />

      {/* Main content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => {
              const isActive =
                item.url === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === item.url || pathname.startsWith(item.url + "/");

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                    <Link href={item.url}>
                      <item.icon className="size-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with user info and theme switcher */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Store />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user?.name || "Pengguna"}</span>
                    <span className="truncate text-xs">{user?.email || "Email tidak tersedia"}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="min-w-56 rounded-lg"
                side="right"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="flex flex-col gap-1 py-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium truncate">{user?.name || "Loading..."}</span>
                  </div>
                  <span className="text-muted-foreground truncate pl-6">
                    {user?.email || "Loading..."}
                  </span>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Theme</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                  <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
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
