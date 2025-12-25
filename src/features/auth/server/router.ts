import z from "zod";
import {
  adminProcedure,
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "../../../trpc/init";

export const productRouter = createTRPCRouter({
  /**
   * Dapatkan keseluruhan produk untuk user
   */
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.product.findMany({
      where: {
        isAvailable: true,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
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
        isAvailable: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, price, categoryId, description, isAvailable } = input;

      return ctx.prisma.product.create({
        data: {
          name,
          price,
          categoryId,
          description,
          isAvailable,
        },
      });
    }),
  /**
   * Hanya admin saja
   */

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        price: z.number().min(0),
        description: z.string().optional(),
        categoryId: z.string(),
        isAvaible: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name, price, description, categoryId, isAvaible } = input;

      return ctx.prisma.product.update({
        where: { id },
        data: {
          name,
          price,
          description,
          categoryId,
          isAvailable: isAvaible,
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

  /**
   * Hanya admin saja
   */
  getByCategory: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.category.findMany();
  }),
});
