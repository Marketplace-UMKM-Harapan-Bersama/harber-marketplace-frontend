"use client";

import { useEffect } from "react";
import Link from "next/link";
import { redirectIfAuthenticated } from "@/lib/utils";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";

export default function SignUpPage() {
  useEffect(() => {
    redirectIfAuthenticated();
  }, []);

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex flex-col items-center gap-2">
        <Link href="/" className="text-4xl font-bold">
          H
        </Link>
        <h1 className="text-xl font-bold">Buat Akun Baru</h1>
        <div className="text-center text-sm">
          Sudah punya akun?{" "}
          <Link href="/sign-in" className="underline underline-offset-4">
            Masuk
          </Link>
        </div>
      </div>
      <div className="w-full max-w-sm">
        <Tabs defaultValue="customer">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="seller">Seller</TabsTrigger>
          </TabsList>
          <TabsContent value="customer">
            <SignUpForm role="customer" />
          </TabsContent>
          <TabsContent value="seller">
            <SignUpForm role="seller" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
