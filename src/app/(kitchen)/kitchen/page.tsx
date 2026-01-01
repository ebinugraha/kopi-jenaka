import { KitchenView } from "@/features/kitchen/views/kitchen-view";
import { prefetchKitchenOrders } from "@/features/orders/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function Page() {
  await prefetchKitchenOrders();

  return (
    <HydrateClient>
      <ErrorBoundary
        fallback={<div>Terjadi kesalahan. Silakan coba lagi nanti.</div>}
      >
        <Suspense fallback={<div>Memuat Orderan...</div>}>
          <KitchenView />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
