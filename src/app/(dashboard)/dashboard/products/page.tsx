import { prefetchProducts } from "@/features/products/server/prefetch";
import ProductsView from "@/features/products/views/product-view";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

const Page = async ({ searchParams }: PageProps) => {
  await prefetchProducts(await searchParams);

  return (
    <HydrateClient>
      <ErrorBoundary
        fallback={<div>Terjadi kesalahan. Silakan coba lagi nanti.</div>}
      >
        <Suspense fallback={<div>Memuat produk...</div>}>
          <ProductsView />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default Page;
