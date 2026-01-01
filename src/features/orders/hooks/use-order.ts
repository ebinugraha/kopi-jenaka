"use client";

import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export const useOrder = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.order.create.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.order.getKitchenOrders.queryOptions()
        );
      },
      onError: (error) => {
        console.error("Error creating order status:", error);
      },
    })
  );
};

export const useSuspenseGetOrder = () => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.order.getKitchenOrders.queryOptions());
};

export const useUpdateStatus = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.order.updateStatus.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.order.getKitchenOrders.queryOptions()
        );
      },
      onError: (error) => {
        console.error("Error updating order status:", error);
      },
    })
  );
};
