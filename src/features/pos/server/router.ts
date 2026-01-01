import z from "zod";
import {
  adminProcedure,
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "../../../trpc/init";
import { checkoutSchema } from "../schemas";
import { TRPCError } from "@trpc/server";

export const orderRouter = createTRPCRouter({
  create: protectedProcedure
    .input(checkoutSchema)
    .mutation(async ({ ctx, input }) => {
      const { items, paymentMethod, customerName, tableId } = input;

      const productIds = items.map((item) => item.productId);
      const dbProducts = await ctx.prisma.product.findMany({
        where: {
          id: { in: productIds },
        },
      });

      let totalAmount = 0;

      const orderItemsData = items.map((item) => {
        const product = dbProducts.find((p) => p.id === item.productId);

        if (!product) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Product with ID ${item.productId} not found`,
          });
        }

        if (!product.isAvailable) {
          {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Product ${product.name} is not available`,
            });
          }
        }

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        };
      });

      const order = await ctx.prisma.order.create({
        data: {
          totalAmount: totalAmount,
          status: "PENDING",
          paymentMethod: paymentMethod,
          isPaid: true,
          cashierId: ctx.user.id,
          items: {
            create: orderItemsData,
          },
        },
      });

      return order;
    }),
});
