"use client";

import {
  useSuspenseGetOrder,
  useUpdateStatus,
} from "@/features/orders/hooks/use-order";
import { OrderCard } from "../components/order-card";

export const KitchenView = () => {
  const { data } = useSuspenseGetOrder();

  const updateStatus = useUpdateStatus();
  if (!data || data.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-muted-foreground">
        <h1 className="text-2xl font-bold">Dapur Sepi 👨‍🍳</h1>
        <p>Belum ada pesanan masuk saat ini.</p>
      </div>
    );
  }
  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">
        👨‍🍳 Kitchen Display System
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onUpdateStatus={(id, status) =>
              updateStatus.mutate({ orderId: id, status })
            }
            isUpdating={updateStatus.isPending}
          />
        ))}
      </div>
    </div>
  );
};
