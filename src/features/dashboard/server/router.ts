import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { endOfDay, startOfDay, subDays, format } from "date-fns";
import { id } from "date-fns/locale";

export const dashboardRouter = createTRPCRouter({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const today = new Date();
    const start = startOfDay(today);
    const end = endOfDay(today);

    const todayOrders = await ctx.prisma.order.aggregate({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
        status: { not: "CANCELLED" },
      },
      _sum: { totalAmount: true },
      _count: { id: true },
    });

    const totalRevenue = Number(todayOrders._sum.totalAmount || 0);
    const totalOrders = todayOrders._count.id;

    const sevenDaysAgo = subDays(today, 6);

    const last7DaysOrders = await ctx.prisma.order.findMany({
      where: {
        createdAt: { gte: startOfDay(sevenDaysAgo) },
        status: { not: "CANCELLED" },
      },
      select: {
        createdAt: true,
        totalAmount: true,
      },
    });

    const chartDataMap = new Map<string, number>();

    for (let i = 0; i < 7; i++) {
      const date = subDays(today, i);
      const key = format(date, "dd MMM", { locale: id });
      chartDataMap.set(key, 0);
    }

    last7DaysOrders.forEach((order) => {
      const key = format(order.createdAt, "dd MMM", { locale: id });
      const current = chartDataMap.get(key) || 0;
      chartDataMap.set(key, current + Number(order.totalAmount));
    });

    // Convert ke array dan balik urutannya (dari lama ke baru)
    const chartData = Array.from(chartDataMap)
      .map(([name, total]) => ({ name, total }))
      .reverse();

    // 3. Top 5 Produk Terlaris
    const topProductsRaw = await ctx.prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: {
        _sum: { quantity: "desc" },
      },
      take: 5,
    });

    // Ambil detail nama produk
    const productIds = topProductsRaw.map((p) => p.productId);
    const productsInfo = await ctx.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const topProducts = topProductsRaw.map((item) => {
      const product = productsInfo.find((p) => p.id === item.productId);
      return {
        name: product?.name || "Unknown",
        count: item._sum.quantity || 0,
        revenue: Number(product?.price || 0) * (item._sum.quantity || 0),
      };
    });

    return {
      today: {
        revenue: totalRevenue,
        count: totalOrders,
      },
      chartData,
      topProducts,
    };
  }),
});
