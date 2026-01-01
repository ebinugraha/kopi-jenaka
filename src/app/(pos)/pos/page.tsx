import { prefetchProducts } from "@/features/pos/server/prefetch";
import POSView from "@/features/pos/views/pos-view";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}
export default async function POSPage({ searchParams }: PageProps) {
  await requireAuth();

  await prefetchProducts(await searchParams);

  return (
    <HydrateClient>
      <ErrorBoundary
        fallback={<div>Terjadi kesalahan. Silakan coba lagi nanti.</div>}
      >
        <Suspense fallback={<div>Memuat produk...</div>}>
          <POSView />;
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
