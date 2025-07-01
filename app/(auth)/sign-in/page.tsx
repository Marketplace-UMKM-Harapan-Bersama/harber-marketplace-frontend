"use client";
import { useEffect } from "react";
import { redirectIfAuthenticated } from "@/lib/auth";
import { SignInForm } from "@/components/auth/sign-in-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  useEffect(() => {
    redirectIfAuthenticated();
  }, []);

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center ">
          <Button variant={"outline"} size={"icon"} asChild>
            <Link
              href={"/"}
              className=" flex items-center gap-2 font-black text-primary mb-5 "
            >
              H
            </Link>
          </Button>
          <h1 className="text-xl font-medium">Halo, Selamat Datang!</h1>
          <p className="text-sm text-muted-foreground">
            Silakan masuk untuk melanjutkan
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}
