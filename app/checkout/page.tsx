"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { createOrder } from "@/lib/api";
import { toast } from "sonner";

// Initial form data
const initialFormData = {
  shipping_address: "Jl. Mangga",
  shipping_city: "Bandung",
  shipping_province: "Jawa Barat",
  shipping_postal_code: "40123",
};

const SHIPPING_COST = 15000; // Rp 15.000 per seller

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = React.useState("bank_transfer");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState(initialFormData);

  // Group items by seller
  const itemsBySeller = React.useMemo(() => {
    return items.reduce((acc, item) => {
      const sellerId = item.seller.id;
      if (!acc[sellerId]) {
        acc[sellerId] = {
          seller: item.seller,
          items: [],
          total: 0,
        };
      }
      acc[sellerId].items.push(item);
      acc[sellerId].total += item.price * item.quantity;
      return acc;
    }, {} as Record<number, { seller: { id: number; shop_name: string }; items: typeof items; total: number }>);
  }, [items]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckout = async () => {
    // Basic validation
    if (
      !formData.shipping_address ||
      !formData.shipping_city ||
      !formData.shipping_province ||
      !formData.shipping_postal_code
    ) {
      toast.error("Mohon lengkapi semua data pengiriman");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create an order for each seller according to the spec
      const orders = Object.values(itemsBySeller).map((sellerData) => ({
        user_id: 1, // Dummy user ID
        seller_id: sellerData.seller.id,
        total_amount: sellerData.total,
        shipping_cost: SHIPPING_COST,
        payment_method: paymentMethod,
        ...formData, // Spread the form data for shipping details
        items: sellerData.items.map((item) => ({
          product_id: item.id,
          price: item.price,
          quantity: item.quantity,
        })),
      }));

      // Call the API to create orders
      await createOrder(orders);

      // Clear cart and show success message
      clearCart();
      toast.success("Order berhasil dibuat!");

      // Redirect to success page
      router.push("/checkout/success");
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal membuat order"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container max-w-3xl py-8 space-y-8 mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-medium">Keranjang kamu kosong</h1>
          <Button asChild>
            <Link href="/">Lanjutkan Belanja</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="container grid grid-cols-1 md:grid-cols-2 gap-8 py-8 px-5 md:px-10 h-screen overflow-y-auto md:overflow-hidden">
      {/* Left Column - Information Forms */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button variant={"reverse"} size={"icon"} asChild>
            <Link href={"/"} className="font-black text-primary">
              H
            </Link>
          </Button>
          <h1 className="text-2xl font-medium font-mono">Checkout</h1>
        </div>
        {/* Shipping Information Form */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium">Alamat Pengiriman</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shipping_address">Alamat</Label>
              <Input
                id="shipping_address"
                name="shipping_address"
                value={formData.shipping_address}
                onChange={handleInputChange}
                placeholder="Masukkan alamat lengkap"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shipping_city">Kota</Label>
              <Input
                id="shipping_city"
                name="shipping_city"
                value={formData.shipping_city}
                onChange={handleInputChange}
                placeholder="Masukkan nama kota"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shipping_province">Provinsi</Label>
              <Input
                id="shipping_province"
                name="shipping_province"
                value={formData.shipping_province}
                onChange={handleInputChange}
                placeholder="Masukkan nama provinsi"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shipping_postal_code">Kode Pos</Label>
              <Input
                id="shipping_postal_code"
                name="shipping_postal_code"
                value={formData.shipping_postal_code}
                onChange={handleInputChange}
                placeholder="Masukkan kode pos"
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Metode Pembayaran</h2>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih metode pembayaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bank_transfer">Transfer Bank</SelectItem>
              <SelectItem value="cod">Cash on Delivery</SelectItem>
              <SelectItem value="ewallet">E-Wallet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Right Column - Order Summary */}
      <div className="space-y-6 bg-muted p-6 rounded-lg border">
        <h2 className="text-lg font-medium">Ringkasan Pesanan</h2>
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 rounded-lg">
          {Object.values(itemsBySeller).map((sellerData) => (
            <div
              key={sellerData.seller.id}
              className="space-y-4 p-4 bg-background rounded-lg border"
            >
              <h3 className="font-medium">
                Toko: {sellerData.seller.shop_name}
              </h3>
              <div className="space-y-4">
                {sellerData.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 border rounded-md overflow-hidden">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} x {formatPrice(item.price)}
                      </p>
                      <p className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(sellerData.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ongkos Kirim</span>
                  <span>{formatPrice(SHIPPING_COST)}</span>
                </div>
                <div className="flex justify-between font-medium mt-2 pt-2 border-t">
                  <span>Total per Toko</span>
                  <span>{formatPrice(sellerData.total + SHIPPING_COST)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total and Checkout Button */}
        <div className="pt-6 border-t space-y-4 sticky bottom-0 bg-muted">
          <div className="flex justify-between text-lg font-medium">
            <span>Total Pembayaran</span>
            <span>
              {formatPrice(
                getTotal() + Object.keys(itemsBySeller).length * SHIPPING_COST
              )}
            </span>
          </div>
          <Button
            className="w-full h-11"
            size="lg"
            onClick={handleCheckout}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              "Bayar Sekarang"
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}
