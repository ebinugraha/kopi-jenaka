import z from "zod";

export const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
      // Kita kirim harga dari client untuk validasi, tapi backend tetap harus cek harga asli DB
    })
  ),
  paymentMethod: z.enum(["CASH", "QRIS", "DEBIT"]),
  // customerName opsional jika untuk dine-in/takeaway tanpa nama
  customerName: z.string().optional(),
  tableId: z.string().optional(),
});
