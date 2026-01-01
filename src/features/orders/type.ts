import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type OrderKitchen = RouterOutput["order"]["getKitchenOrders"][number];
