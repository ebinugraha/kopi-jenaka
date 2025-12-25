import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

/**
 * Mengambil seluruh produk
 */
export const useSuspenseProducts = () => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.product.getAll.queryOptions({}));
};

export const useCreateProduct = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.product.create.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.product.getAll.queryOptions({})
        );
      },
      onError: (error) => {
        console.error("Error creating product:", error);
      },
    })
  );
};

export const useUpdateProduct = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.product.update.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.product.getAll.queryOptions({})
        );
      },
      onError: (error) => {
        console.error("Error updating product:", error);
      },
    })
  );
};

export const useDeleteProduct = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.product.delete.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.product.getAll.queryOptions({})
        );
      },
      onError: (error) => {
        console.error("Error deleting product:", error);
      },
    })
  );
};
