import z from "zod";
import {
  adminProcedure,
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "../../../trpc/init";

export const categoryRouter = createTRPCRouter({
  /**
   * Dapatkan keseluruhan produk untuk user
   */
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.category.findMany({ orderBy: { name: "asc" } });
  }),
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, description } = input;

      return ctx.prisma.category.create({
        data: {
          name,
          description,
        },
      });
    }),
});
