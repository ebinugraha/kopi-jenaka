import { prefetch, trpc } from "@/trpc/server";
import { inferInput } from "@trpc/tanstack-react-query";

type Input = inferInput<typeof trpc.product.getAll>;

export const prefetchProducts = async (params: Input) => {
  return await prefetch(trpc.product.getAll.queryOptions(params));
};
