// src/app/(pos)/pos/page.tsx
"use client";

import { ProductGrid } from "@/features/pos/components/product-grid";
import { CartSidebar } from "@/features/pos/components/cart-sidebar";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useSuspenseProducts } from "@/features/products/hooks/use-products";
import { requireAuth } from "@/lib/auth-utils";
import { authClient } from "@/utils/auth-client";

export default function POSView() {
  const [search, setSearch] = useState("");
  const data = authClient.useSession();

  // Fetch Produk
  const { data: products, isLoading } = useSuspenseProducts();

  // Filter Lokal (Client Side) untuk performa cepat
  const filteredProducts =
    products?.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

  return (
    <div className="flex h-full">
      {/* Area Kiri: Daftar Produk */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header POS */}
        <div className="h-16 border-b bg-white px-6 flex items-center justify-between shadow-sm z-10">
          <h1 className="font-bold text-xl text-primary">☕ Kopi Jenaka POS</h1>
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari menu..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <ProductGrid products={filteredProducts} isLoading={isLoading} />
        </div>
      </div>

      {/* Area Kanan: Cart */}
      <div className="w-[350px] h-full shadow-xl z-20">
        <CartSidebar />
      </div>
    </div>
  );
}
