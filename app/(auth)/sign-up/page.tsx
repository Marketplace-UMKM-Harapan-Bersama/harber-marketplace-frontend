"use client";

import { useEffect } from "react";
import Link from "next/link";
import { redirectIfAuthenticated } from "@/lib/auth";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  useEffect(() => {
    redirectIfAuthenticated();
  }, []);

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex flex-col items-center ">
        <Button variant={"outline"} size={"icon"} asChild>
          <Link
            href={"/"}
            className=" flex items-center gap-2 font-black text-primary mb-5 "
          >
            H
          </Link>
        </Button>
        <h1 className="text-xl font-medium">Buat Akun Baru</h1>
        <p className="text-sm text-muted-foreground max-w-xs text-center">
          Daftar sebagai Customer atau Seller untuk mulai menggunakan layanan
          kami.
        </p>
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
