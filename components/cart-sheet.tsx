"use client";

import * as React from "react";
import { ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { ClearCartDialog } from "./cart/clear-cart-dialog";

export function CartSheet() {
  const [isOpen, setIsOpen] = React.useState(false);
  const {
    items,
    updateQuantity,
    removeItem,
    getTotal,
    syncWithServer,
    clearCart,
    isLoading,
  } = useCartStore();
  const { isAuthed } = useAuth();

  // Sync cart with server when component mounts and user is authenticated
  React.useEffect(() => {
    if (isAuthed) {
      syncWithServer();
    }
  }, [isAuthed, syncWithServer]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <SheetTrigger asChild>
        <Button variant="noShadow" size="icon" className="relative">
          <ShoppingCart className="w-4 h-4" fill="currentColor" />
          {isAuthed && items.length > 0 && (
            <span className="border border-primary-foreground absolute -top-1 rounded-md -right-1 bg-primary text-primary-foreground text-xs w-4 h-4 flex items-center justify-center">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Keranjang</SheetTitle>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 h-[50vh]">
          {!isAuthed ? (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
              <ShoppingCart className="w-20 h-20" />
              <p className="text-muted-foreground mb-4 text-center">
                Keranjang kamu kosong
              </p>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Lanjutkan Belanja
              </Button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
              <ShoppingCart className="w-20 h-20" />
              <p className="text-muted-foreground mb-4">
                Keranjang kamu kosong
              </p>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Lanjutkan Belanja
              </Button>
            </div>
          ) : (
            <div className="space-y-6 py-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 relative mx-4 border-b pb-4"
                >
                  <div className="aspect-square h-20 border rounded-md relative">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />

                    <button
                      className="absolute z-10 -top-2 -left-2 text-muted-foreground hover:text-foreground p-1.5 border bg-muted shadow rounded-md"
                      onClick={() => removeItem(item.id)}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium leading-none">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.seller.shop_name}
                        </p>
                      </div>
                      <p className="font-medium">{formatPrice(item.price)}</p>
                    </div>
                    <div className="absolute bottom-5 -right-1 items-center gap-2">
                      <div className="flex items-center rounded-md border">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-l-md"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1 || isLoading}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-r-md"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.stock || isLoading}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-center">
            {items.length > 0 && (
              <ClearCartDialog onClearCart={clearCart} isLoading={isLoading} />
            )}
          </div>
        </ScrollArea>
        <SheetFooter>
          {isAuthed && items.length > 0 && (
            <div className="border-t pt-6 space-y-6 w-full">
              <div className="space-y-2">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
              </div>
              <Button className="w-full h-11" size="lg" asChild>
                <Link href="/checkout">Checkout Sekarang</Link>
              </Button>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
