"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

export const useOrder = () => {
  const trpc = useTRPC();

  return useMutation(trpc.order.create.mutationOptions());
};
