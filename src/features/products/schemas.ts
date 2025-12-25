import z from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi"),
  price: z.coerce
    .number<number>()
    .min(0, "Harga produk wajib diisi dan tidak boleh negatif"),
  categoryId: z.string().min(1, "Kategori produk wajib diisi"),
  description: z.string().optional(),
  isAvailable: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
