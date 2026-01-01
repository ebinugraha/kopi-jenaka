import { createTRPCRouter } from "../init";
import { productRouter } from "../../features/products/server/router";
import { categoryRouter } from "@/features/categories/server/router";
import { orderRouter } from "@/features/orders/server/router";
export const appRouter = createTRPCRouter({
  product: productRouter,
  category: categoryRouter,
  order: orderRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
