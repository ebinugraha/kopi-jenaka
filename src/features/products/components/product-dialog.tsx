import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateProduct } from "../hooks/use-products";
import z from "zod";
import { useGetCategory } from "@/features/categories/hooks/use-category";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const productSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi"),
  price: z.number().min(0, "Harga produk wajib diisi"),
  categoryId: z.string().min(1, "Kategori produk wajib diisi"),
  description: z.string().optional(),
  isAvailable: z.boolean().default(true),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProductDialog = ({ isOpen, onOpenChange }: ProductDialogProps) => {
  const form = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      price: 0,
      categoryId: "",
      description: "",
      isAvailable: true,
    },
  });

  const createProduct = useCreateProduct();
  const category = useGetCategory();

  const onSubmit = (data: ProductFormValues) => {
    console.log(data);
    createProduct.mutate(data, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
        toast.success("Produk berhasil ditambahkan");
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          {/* TODO add update product */}
          <DialogTitle>Tambah Produk</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col gap-y-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormControl>
                  <Input placeholder="Nama" {...field} />
                </FormControl>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Harga"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Kategori" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {category.data?.map((cat) => {
                      return (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormControl>
                  <Input placeholder="Deskripsi" {...field} />
                </FormControl>
              )}
            />
            {/* Add submit button and handlers as needed */}
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
