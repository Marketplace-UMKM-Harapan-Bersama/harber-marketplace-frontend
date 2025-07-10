import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { CartConfirmDialogProvider } from "@/components/cart/cart-confirm-dialog-provider";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 px-5">{children}</main>
      <Footer />
      <CartConfirmDialogProvider />
    </div>
  );
}
