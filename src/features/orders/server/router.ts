import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../../../trpc/init";
import { TRPCError } from "@trpc/server";
import { checkoutSchema } from "../schema";
import { OrderStatus } from "../../../../prisma/generated/enums";

export const orderRouter = createTRPCRouter({
  create: protectedProcedure
    .input(checkoutSchema)
    .mutation(async ({ ctx, input }) => {
      const { items, paymentMethod } = input;

      let totalAmount = 0;

      const productIds = items.map((item) => item.productId);
      const dbProduct = await ctx.prisma.product.findMany({
        where: {
          id: { in: productIds },
        },
      });

      const orderItemsData = items.map((item) => {
        const product = dbProduct.find((p) => p.id === item.productId);
        if (!product) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Product with ID ${item.productId} not found`,
          });
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
          totalAmount,
          items: {
            create: orderItemsData,
          },
          status: "PENDING",
          paymentMethod,
          isPaid: true,
          cashierId: ctx.session.user.id,
        },
      });

      return order;
    }),

  getKitchenOrders: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.order.findMany({
      where: {
        status: { in: ["PENDING", "COOKING"] },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        cashier: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        status: z.enum(OrderStatus),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.status === "PENDING") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Cannot update order status back to PENDING`,
        });
      }

      return ctx.prisma.order.update({
        where: { id: input.orderId },
        data: { status: input.status },
      });
    }),
});
