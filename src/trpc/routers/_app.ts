import { createTRPCRouter } from "../init";
import { productRouter } from "../../features/products/server/router";
import { categoryRouter } from "@/features/categories/server/router";
import { orderRouter } from "@/features/orders/server/router";
import { dashboardRouter } from "@/features/dashboard/server/router";
export const appRouter = createTRPCRouter({
  product: productRouter,
  category: categoryRouter,
  order: orderRouter,
  dashboard: dashboardRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
