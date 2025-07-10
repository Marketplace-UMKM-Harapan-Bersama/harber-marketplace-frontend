"use client";

import { useCartStore } from "@/lib/store";
import { CartConfirmDialog } from "./cart-confirm-dialog";

export function CartConfirmDialogProvider() {
  const {
    showConfirmDialog,
    setShowConfirmDialog,
    pendingItem,
    setPendingItem,
    clearCart,
  } = useCartStore();

  const handleConfirm = async () => {
    if (pendingItem) {
      await clearCart();
      // Re-add the pending item after clearing the cart
      await useCartStore.getState().addItem(pendingItem);
    }
    setShowConfirmDialog(false);
    setPendingItem(null);
};

  const handleCancel = () => {
    setShowConfirmDialog(false);
    setPendingItem(null);
  };

  return (
    <CartConfirmDialog
      open={showConfirmDialog}
      onOpenChange={setShowConfirmDialog}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );
}
