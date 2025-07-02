import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      addItem: (item) => {
        const existingItem = get().items.find((i) => i.id === item.id);

        if (existingItem) {
          return get().updateQuantity(item.id, existingItem.quantity + 1);
        }

        set((state) => ({
          items: [...state.items, { ...item, quantity: 1 }],
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          return get().removeItem(id);
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      clearCart: () => {
        set({ items: [] });
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
