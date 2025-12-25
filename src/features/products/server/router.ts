import z from "zod";
import {
  adminProcedure,
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "../../../trpc/init";
import { productSchema } from "../schemas";

export const productRouter = createTRPCRouter({
  /**
   * Dapatkan keseluruhan produk untuk user
   */
  getAll: protectedProcedure
    .input(z.object({ search: z.string().default("") }))
    .query(async ({ ctx, input }) => {
      const { search } = input;

      return await ctx.prisma.product.findMany({
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
    .input(productSchema)
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
      productSchema.extend({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name, price, description, categoryId, isAvailable } = input;

      return ctx.prisma.product.update({
        where: { id },
        data: {
          name,
          price,
          description,
          categoryId,
          isAvailable: isAvailable,
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
