"use client";
import { useEffect } from "react";
import { redirectIfAuthenticated } from "@/lib/utils";
import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  useEffect(() => {
    redirectIfAuthenticated();
  }, []);

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignInForm />
      </div>
    </div>
  );
}
