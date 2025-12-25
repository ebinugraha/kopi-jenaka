import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "../types";
import { useCreateProduct, useUpdateProduct } from "../hooks/use-products";
import { ProductFormValues } from "../schemas";
import { toast } from "sonner";
import { ProductForm } from "./product-form";

interface ProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productToEdit?: Product | null;
}

export const ProductDialog = ({
  isOpen,
  onOpenChange,
  productToEdit,
}: ProductDialogProps) => {
  const create = useCreateProduct();
  const update = useUpdateProduct();

  const handleSubmit = (values: ProductFormValues) => {
    {
      if (productToEdit) {
        update.mutate(
          {
            id: productToEdit.id,
            ...values,
          },
          {
            onSuccess: () => {
              toast.success("Produk berhasil diperbarui");
            },
          }
        );
      } else {
        create.mutate(values, {
          onSuccess: () => {
            toast.success("Produk berhasil ditambahkan");
          },
        });
      }
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>
            {productToEdit ? "Edit Produk" : "Tambah Produk Baru"}
          </DialogTitle>
          <DialogDescription>
            {productToEdit
              ? "Perbarui detail produk di bawah ini."
              : "Isi form untuk menambahkan menu baru."}
          </DialogDescription>
        </DialogHeader>

        {/* Kunci reusability ada di sini:
            Kita reset form state dengan `key`. 
            Jika productToEdit berubah ID-nya (atau jadi null), 
            React akan menghancurkan form lama dan buat baru (fresh state).
        */}
        <ProductForm
          key={productToEdit?.id || "create"}
          onSubmit={handleSubmit}
          submitLabel={productToEdit ? "Simpan Perubahan" : "Buat Produk"}
          defaultValues={
            productToEdit
              ? {
                  name: productToEdit.name,
                  price: productToEdit.price, // Sudah number (aman)
                  categoryId: productToEdit.categoryId,
                  description: productToEdit.description || "",
                  isAvailable: productToEdit.isAvailable,
                }
              : undefined
          }
        />
      </DialogContent>
    </Dialog>
  );
};
