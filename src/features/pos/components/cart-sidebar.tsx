"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2, Minus, Plus, CreditCard } from "lucide-react";
import { useCart } from "../hooks/use-cart";
import { toast } from "sonner";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrder } from "@/features/orders/hooks/use-order";

export function CartSidebar() {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
    useCart();
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "QRIS" | "DEBIT">(
    "CASH"
  );

  const order = useOrder();

  const handleCheckout = () => {
    console.log(
      "Checkout with items:",
      items,
      "and payment method:",
      paymentMethod
    );

    order.mutate(
      {
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        paymentMethod: paymentMethod,
        customerName: "Pelanggan",
      },
      {
        onSuccess: () => {
          toast.success("Order berhasil diproses");
          clearCart();
        },
        onError: () => {
          toast.error("Gagal memproses order");
        },
      }
    );
  };

  const total = getTotalPrice();

  return (
    <div className="flex flex-col h-full border-l bg-card">
      {/* Header Cart */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold text-lg">Pesanan Baru</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 text-xs"
          onClick={clearCart}
        >
          Reset
        </Button>
      </div>

      {/* List Items */}
      <ScrollArea className="flex-1 p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground text-sm">
            <CreditCard className="h-10 w-10 mb-2 opacity-20" />
            <p>Belum ada item dipilih</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3">
                {/* Qty Control */}
                <div className="flex flex-col items-center gap-1 bg-muted rounded-md p-1 h-fit">
                  <button
                    onClick={() => updateQuantity(item.id, "increment")}
                    className="h-6 w-6 flex items-center justify-center hover:bg-white rounded text-xs"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  <span className="text-xs font-bold">{item.quantity}</span>
                  <button
                    onClick={() =>
                      item.quantity > 1
                        ? updateQuantity(item.id, "decrement")
                        : removeFromCart(item.id)
                    }
                    className="h-6 w-6 flex items-center justify-center hover:bg-white rounded text-xs text-red-500"
                  >
                    {item.quantity > 1 ? (
                      <Minus className="h-3 w-3" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </button>
                </div>

                {/* Detail Item */}
                <div className="flex-1">
                  <h4 className="font-medium text-sm line-clamp-1">
                    {item.name}
                  </h4>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">
                      @ {new Intl.NumberFormat("id-ID").format(item.price)}
                    </span>
                    <span className="font-semibold text-sm">
                      {new Intl.NumberFormat("id-ID").format(
                        item.price * item.quantity
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer / Checkout */}
      <div className="p-4 bg-muted/20 border-t space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(total)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Pajak (0%)</span>
            <span>Rp 0</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-primary">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(total)}
            </span>
          </div>
        </div>

        {/* Metode Pembayaran */}
        <Select
          value={paymentMethod}
          onValueChange={(v: any) => setPaymentMethod(v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih Pembayaran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CASH">Tunai (Cash)</SelectItem>
            <SelectItem value="QRIS">QRIS</SelectItem>
            <SelectItem value="DEBIT">Debit Card</SelectItem>
          </SelectContent>
        </Select>

        <Button
          className="w-full h-12 text-lg font-bold"
          onClick={handleCheckout}
          disabled={items.length === 0 || order.isPending}
        >
          {order.isPending ? "Memproses..." : "Bayar Sekarang"}
        </Button>
      </div>
    </div>
  );
}
