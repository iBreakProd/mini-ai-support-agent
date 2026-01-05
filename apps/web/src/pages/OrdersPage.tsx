import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import api from "@/lib/api";
import { AppShell } from "@/components/layout/AppShell";
import { Modal } from "@/components/ui/Modal";
import { OrderCard, type ProductForOrder } from "@/components/orders/OrderCard";
import { CheckoutForm } from "@/components/orders/CheckoutForm";
import { groupOrdersByOrderId } from "@/lib/orderUtils";

export function OrdersPage() {
  const location = useLocation();
  const addProduct = (location.state as { addProduct?: { productId: string; quantity: number } })?.addProduct;
  const [showAddOrder, setShowAddOrder] = useState(() => !!addProduct);

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

  const initialCart = useMemo(() => {
    if (!addProduct || !products?.length) return undefined;
    const p = products.find((pr: { id: string }) => pr.id === addProduct!.productId);
    if (!p) return undefined;
    const qty = Math.max(1, addProduct.quantity);
    const unitPrice = Number.parseFloat((p as { price: string }).price);
    return [{ productId: p.id, quantity: qty, unitPrice, lineTotal: unitPrice * qty }];
  }, [addProduct, products]);

  const productsForOrders: ProductForOrder[] = (products ?? []).map(
    (p: { id: string; name: string; imageUrl: string; subCategory: string; category?: string }) => ({
      id: p.id,
      name: p.name,
      imageUrl: p.imageUrl,
      subCategory: p.subCategory,
      category: p.category,
    })
  );

  if (ordersLoading)
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
      <main className="lg:pl-24 min-h-screen bg-grid-pattern p-4 md:p-8 lg:pr-8 relative">
        <div className="fixed top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0" />
        <div className="fixed bottom-20 left-40 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none z-0" />
        <div className="relative z-10 max-w-5xl mx-auto pt-24 lg:pt-12">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 border-b border-neutral-border pb-8 gap-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                ORDER <br/> <span className="text-outline">HISTORY</span>
              </h1>
              <p className="text-gray-400 mt-4 max-w-xl">
                Track your hydration hardware. View past acquisitions, shipping telemetry, and digital receipts for your premium vessels.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddOrder(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark w-full md:w-auto transition-colors"
            >
              <Plus className="size-5" />
              Add order
            </button>
          </div>

          <div className="grid gap-6">
            {(orders ?? []).map((row) => (
              <OrderCard key={row.order.id} row={row} products={productsForOrders} />
            ))}
            {(!orders || orders.length === 0) && (
              <p className="text-gray-400">No orders yet.</p>
            )}
          </div>

          <Modal
            open={showAddOrder}
            onClose={() => setShowAddOrder(false)}
            title="Add order"
          >
            {productsLoading ? (
              <div className="text-gray-400">Loading products…</div>
            ) : (
              <CheckoutForm
                products={productOptions}
                initialCart={initialCart}
                onSuccess={() => setShowAddOrder(false)}
              />
            )}
          </Modal>
        </div>
      </main>
    </AppShell>
  );
}
