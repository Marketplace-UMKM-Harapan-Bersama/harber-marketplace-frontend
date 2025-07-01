"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { authService } from "@/lib/api";
import { SignInFormValues, signInSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Loader } from "lucide-react";

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignInFormValues) {
    setError(null);
    try {
      setIsLoading(true);
      await authService.signIn(data);
      router.push("/");
      toast.success("selamat datang 👋🏼");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Terjadi kesalahan saat login. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col gap-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  "Masuk"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <div className="text-center text-sm">
        Belum punya akun?{" "}
        <Link href="/sign-up" className="underline underline-offset-4">
          Daftar
        </Link>
      </div>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Dengan melanjutkan, Anda setuju dengan{" "}
        <Link href="#">Syarat dan Ketentuan</Link> dan{" "}
        <Link href="#">Kebijakan Privasi</Link>.
      </div>
    </div>
  );
}
