import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import * as api from "./api";
import type { CartError } from "./types";

export interface CartItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  image_url: string;
  quantity: number;
  stock: number;
  seller: {
    id: number;
    shop_name: string;
  };
  category?: {
    id: number;
    name: string;
  };
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => Promise<void>;
  removeItem: (cartId: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotal: () => number;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  syncWithServer: () => Promise<void>;
  getCurrentSellerId: () => number | null;
  showConfirmDialog: boolean;
  setShowConfirmDialog: (show: boolean) => void;
  pendingItem: Omit<CartItem, "quantity"> | null;
  setPendingItem: (item: Omit<CartItem, "quantity"> | null) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      showConfirmDialog: false,
      pendingItem: null,

      getCurrentSellerId: () => {
        const items = get().items;
        return items.length > 0 ? items[0].seller.id : null;
      },

      setShowConfirmDialog: (show: boolean) => {
        set({ showConfirmDialog: show });
      },

      setPendingItem: (item: Omit<CartItem, "quantity"> | null) => {
        set({ pendingItem: item });
      },

      syncWithServer: async () => {
        try {
          const response = await api.getCart();
          // Transform API cart items to match our local CartItem structure
          const items = response.data.map((item) => ({
            id: item.id, // Use cart item ID instead of product ID
            name: item.product.name,
            description: item.product.description,
            price: parseFloat(item.product.price),
            image_url: item.product.image_url,
            quantity: item.quantity,
            stock: item.product.stock,
            seller: {
              id: item.product.seller_id,
              shop_name: item.product.seller?.shop_name || "",
            },
            category: item.product.category,
          }));
          set({ items });
        } catch (error) {
          console.error("Failed to sync cart with server:", error);
          toast.error("Gagal memuat keranjang");
        }
      },

      addItem: async (item) => {
        set({ isLoading: true });
        try {
          const currentSellerId = get().getCurrentSellerId();

          // Check if adding item from different seller
          if (currentSellerId && currentSellerId !== item.seller.id) {
            set({ showConfirmDialog: true, pendingItem: item });
            set({ isLoading: false });
            return;
          }

          // Update local state first for immediate feedback
          const existingItem = get().items.find((i) => i.id === item.id);
          if (existingItem) {
            await get().updateQuantity(item.id, existingItem.quantity + 1);
          } else {
            set((state) => ({
              items: [...state.items, { ...item, quantity: 1 }],
            }));
          }

          // Then sync with server
          await api.addToCart(item.id, 1);
          toast.success("Produk ditambahkan ke keranjang");
        } catch (error) {
          // Handle specific error types
          if (
            (error as { response?: { data?: CartError } })?.response?.data
              ?.error_type === "different_seller"
          ) {
            toast.error("Gagal menambahkan produk dari penjual berbeda");
          } else {
            toast.error("Gagal menambahkan ke keranjang");
          }
          await get().syncWithServer();
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (id, quantity) => {
        set({ isLoading: true });
        try {
          if (quantity <= 0) {
            await get().removeItem(id);
            return;
          }

          // Update local state first
          set((state) => ({
            items: state.items.map((item) =>
              item.id === id ? { ...item, quantity } : item
            ),
          }));

          // Then sync with server
          const diff =
            quantity - (get().items.find((i) => i.id === id)?.quantity || 0);
          if (diff > 0) {
            await api.increaseCartItemQuantity(id);
          } else if (diff < 0) {
            await api.decreaseCartItemQuantity(id);
          }
        } catch {
          toast.error("Gagal mengubah jumlah");
          await get().syncWithServer();
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (cartId) => {
        set({ isLoading: true });
        try {
          // Update local state first
          set((state) => ({
            items: state.items.filter((item) => item.id !== cartId),
          }));

          // Then sync with server
          await api.removeFromCart(cartId);
          toast.success("Produk dihapus dari keranjang");
        } catch {
          toast.error("Gagal menghapus dari keranjang");
          await get().syncWithServer();
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: async () => {
        set({ isLoading: true });
        try {
          set({ items: [] });
          await api.clearCart();
          toast.success("Keranjang dikosongkan");
        } catch {
          toast.error("Gagal mengosongkan keranjang");
          await get().syncWithServer();
        } finally {
          set({ isLoading: false });
        }
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      setIsLoading: (isLoading: boolean) => {
        set({ isLoading });
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
