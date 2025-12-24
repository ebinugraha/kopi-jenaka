import z from "zod";
import { adminProcedure, baseProcedure, createTRPCRouter } from "../init";

export const productRouter = createTRPCRouter({
  /**
   * Dapatkan keseluruhan produk untuk user
   */
  getAll: baseProcedure.query(async ({ ctx }) => {
    return ctx.prisma.product.findMany({
      where: {
        isAvailable: true,
      },
      include: {
        category: true,
      },
    });
  }),
  /**
   * Hanya admin saja
   */
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        price: z.number().min(0),
        categoryId: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, price, categoryId, description } = input;

      return ctx.prisma.product.create({
        data: {
          name,
          price,
          categoryId,
          description,
        },
      });
    }),
  /**
   * Hanya admin saja
   */
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      return ctx.prisma.product.delete({
        where: { id },
      });
    }),
});
