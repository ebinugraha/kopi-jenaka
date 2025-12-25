"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Pastikan Anda punya komponen Badge, atau ganti dengan span biasa
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Import tipe strict yang sudah kita buat sebelumnya
import { Product } from "../types";
import { useDeleteProduct } from "../hooks/use-products";

type ProductTableProps = {
  data: Product[];
  isLoading?: boolean;
  onEdit: (product: Product) => void; // Callback untuk tombol Edit
};

export const ProductTable = ({
  data,
  isLoading,
  onEdit,
}: ProductTableProps) => {
  const deleteMutation = useDeleteProduct();

  const handleDelete = (id: string) => {
    deleteMutation.mutate({ id });
  };

  // State Loading
  if (isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center border rounded-md">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Memuat data...</span>
      </div>
    );
  }

  // State Kosong
  if (!data || data.length === 0) {
    return (
      <div className="flex h-48 w-full flex-col items-center justify-center border rounded-md text-muted-foreground">
        <p>Belum ada produk.</p>
        <p className="text-sm">Tambahkan produk baru untuk memulai.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Produk</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((product) => (
            <TableRow key={product.id}>
              {/* Nama Produk & Deskripsi Singkat */}
              <TableCell className="font-medium">
                <div>{product.name}</div>
                {product.description && (
                  <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {product.description}
                  </div>
                )}
              </TableCell>

              {/* Kategori */}
              <TableCell>
                <Badge variant="outline">
                  {product.category?.name || "Tanpa Kategori"}
                </Badge>
              </TableCell>

              {/* Harga (Format IDR) */}
              <TableCell>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }).format(product.price)}
              </TableCell>

              {/* Status Ketersediaan */}
              <TableCell>
                <Badge
                  variant={product.isAvailable ? "default" : "destructive"}
                  className={
                    product.isAvailable
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }
                >
                  {product.isAvailable ? "Tersedia" : "Habis"}
                </Badge>
              </TableCell>

              {/* Tombol Aksi */}
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {/* Tombol Edit */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(product)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  {/* Tombol Delete (dengan Konfirmasi) */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Produk?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus{" "}
                          <b>{product.name}</b>? Tindakan ini tidak dapat
                          dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
