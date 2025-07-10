"use client";

import { ThemeProvider } from "next-themes";

import { QueryProvider } from "@/components/layout/query-provider";
import { Toaster } from "sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "@/hooks/use-auth-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <QueryProvider>
          {children}
          <ReactQueryDevtools />
        </QueryProvider>
      </AuthProvider>
      <Toaster position="top-center" richColors />
    </ThemeProvider>
  );
}
