import z from "zod";

export const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
    })
  ),
  paymentMethod: z.enum(["CASH", "QRIS", "DEBIT"]),
  customerName: z.string().optional(),
});
