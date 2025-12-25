"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSuspenseProducts } from "../hooks/use-products";
import { ProductDialog } from "../components/product-dialog";
import { ProductTable } from "../components/product-table";
import { Product } from "../types";

export default function ProductsView() {
  const [isOpen, setIsOpen] = useState(false);
  const product = useSuspenseProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <>
      <ProductDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        productToEdit={selectedProduct}
      />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Daftar Menu</h1>
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Produk
          </Button>
        </div>
        <ProductTable
          data={product.data}
          onEdit={(product) => {
            setSelectedProduct(product);
            setIsOpen(true);
          }}
        />
      </div>
    </>
  );
}
