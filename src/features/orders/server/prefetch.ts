import { prefetch, trpc } from "@/trpc/server";

export const prefetchKitchenOrders = async () => {
  return await prefetch(trpc.order.getKitchenOrders.queryOptions());
};
