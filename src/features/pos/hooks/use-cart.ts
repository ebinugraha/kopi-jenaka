import { Product } from "@/features/products/types";
import { create } from "zustand";

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, type: "increment" | "decrement") => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],

  addToCart: (product) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        // jika sudah ada, tambahkan quantity
        return {
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        items: [...state.items, { ...product, quantity: 1 }],
      };
    }),

  removeFromCart: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    })),
  updateQuantity: (productId, type) =>
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id !== productId) return item;
        const newQuantity =
          type === "increment" ? item.quantity + 1 : item.quantity - 1;
        return { ...item, quantity: Math.max(newQuantity, 1) }; // pastikan quantity tidak kurang dari 1
      }),
    })),
  clearCart: () => set({ items: [] }),
  getTotalPrice: () => {
    const items = get().items;
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));
