import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { productRouter } from "./product";
export const appRouter = createTRPCRouter({
  product: productRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
