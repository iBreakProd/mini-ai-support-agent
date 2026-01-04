import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { AppShell } from "@/components/layout/AppShell";
import { OrderCard } from "@/components/orders/OrderCard";
import { CheckoutForm } from "@/components/orders/CheckoutForm";
import { groupOrdersByOrderId } from "@/lib/orderUtils";

export function OrdersPage() {
  const location = useLocation();
  const addProduct = (location.state as { addProduct?: { productId: string; quantity: number } })?.addProduct;
  const [tab, setTab] = useState<"history" | "new">(() => (addProduct ? "new" : "history"));

  useEffect(() => {
    if (addProduct) setTab("new");
  }, [addProduct]);

  const { data: orders, isLoading: ordersLoading, isError: ordersError, error: ordersErrorObj } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await api.get("/orders");
      const rows = res.data.data ?? [];
      return groupOrdersByOrderId(rows);
    },
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data.data ?? [];
    },
  });

  const productOptions = (products ?? []).map((p: { id: string; name: string; price: string }) => ({
    id: p.id,
    name: p.name,
    price: p.price,
  }));

  if (ordersLoading && tab === "history")
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center">
          Loading orders…
        </div>
      </AppShell>
    );
  if (ordersError)
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center text-red-400">
          {ordersErrorObj?.message}
        </div>
      </AppShell>
    );

  return (
    <AppShell>
      <main className="lg:pl-20 min-h-screen bg-grid-pattern p-4 md:p-12">
        <div className="max-w-6xl mx-auto pt-12">
          <h1 className="text-3xl font-bold font-display mb-2">Orders</h1>
          <p className="text-gray-400 mb-6">
            Place a new order or view your order history. Open to all visitors.
          </p>

          <div className="flex gap-4 mb-8 border-b border-neutral-border">
            <button
              type="button"
              onClick={() => setTab("history")}
              className={`pb-2 font-semibold transition-colors ${
                tab === "history" ? "text-primary border-b-2 border-primary" : "text-gray-400 hover:text-white"
              }`}
            >
              Order history
            </button>
            <button
              type="button"
              onClick={() => setTab("new")}
              className={`pb-2 font-semibold transition-colors ${
                tab === "new" ? "text-primary border-b-2 border-primary" : "text-gray-400 hover:text-white"
              }`}
            >
              New order
            </button>
          </div>

          {tab === "history" ? (
            <div className="space-y-4">
              {(orders ?? []).map((row) => (
                <OrderCard key={row.order.id} row={row} />
              ))}
              {(!orders || orders.length === 0) && (
                <p className="text-gray-400">No orders yet.</p>
              )}
            </div>
          ) : (
            productsLoading ? (
              <div className="text-gray-400">Loading products…</div>
            ) : (
              <CheckoutForm products={productOptions} initialAddProduct={addProduct} />
            )
          )}
        </div>
      </main>
    </AppShell>
  );
}
