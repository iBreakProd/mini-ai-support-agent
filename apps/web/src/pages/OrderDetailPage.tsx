import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, HelpCircle } from "lucide-react";
import api from "@/lib/api";
import { AppShell } from "@/components/layout/AppShell";
import { useChatWidget } from "@/contexts/ChatWidgetContext";

type Order = {
  id: string;
  shippingStatus: string;
  total: string;
  createdAt: string;
  paymentMethod: string;
  shippingAddress?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  deliveryInstructions?: string;
  totalPrice?: string;
  tax?: string;
  shipping?: string;
  discount?: string;
};

type OrderItem = {
  productId: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  product: { id: string; name: string; imageUrl: string };
};

type OrderDetail = {
  order: Order;
  items: OrderItem[];
};

function formatPaymentMethod(method: string): string {
  const map: Record<string, string> = {
    card: "Credit Card",
    credit_card: "Credit Card",
    visa: "Visa",
    apple_pay: "Apple Pay",
  };
  return map[method?.toLowerCase()] ?? method ?? "Card";
}

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { openChatWithMessage } = useChatWidget();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await api.get<{ data: OrderDetail }>(`/orders/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

  if (isLoading)
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center">
          Loading…
        </div>
      </AppShell>
    );

  if (isError || !data) {
    return (
      <AppShell>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-red-400">
            {error instanceof Error ? error.message : "Order not found"}
          </p>
          <Link
            to="/orders"
            className="text-primary hover:underline font-semibold"
          >
            Back to orders
          </Link>
        </div>
      </AppShell>
    );
  }

  const { order, items } = data;
  const shortId = order.id.replace(/-/g, "").slice(-8).toUpperCase();
  const placedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <AppShell>
      <main className="lg:pl-24 min-h-screen bg-grid-pattern p-4 md:p-8 lg:pr-8">
        <div className="fixed top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0" />
        <div className="fixed bottom-20 left-40 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none z-0" />
        <div className="relative z-10 max-w-5xl mx-auto pt-24 lg:pt-12">
          <div className="flex items-center text-xs tracking-widest text-gray-500 uppercase mb-8">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="size-4 mx-2" />
            <Link to="/orders" className="hover:text-primary transition-colors">
              Orders
            </Link>
            <ChevronRight className="size-4 mx-2" />
            <span className="text-white">#ORD-{shortId}</span>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 border-b border-neutral-border pb-8 gap-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                ORDER <br />{" "}
                <span className="text-outline">#ORD-{shortId}</span>
              </h1>
              <p className="text-gray-400 mt-4 max-w-xl">
                Placed on {placedDate} · {order.shippingStatus}
              </p>
            </div>
            <button
              type="button"
              onClick={() => openChatWithMessage(`#ORD-${shortId}`)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-neutral-border hover:border-primary hover:bg-primary/10 text-white font-semibold w-full md:w-auto transition-colors"
            >
              <HelpCircle className="size-5" />
              Get Help
            </button>
          </div>

          <div className="glass-panel p-6 md:p-8 rounded-lg space-y-8">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                Items
              </p>
              <div className="border border-neutral-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/5 text-left">
                      <th className="px-4 py-3 text-gray-400 font-medium">
                        Product
                      </th>
                      <th className="px-4 py-3 text-gray-400 font-medium w-20 text-center">
                        Qty
                      </th>
                      <th className="px-4 py-3 text-gray-400 font-medium text-right">
                        Unit Price
                      </th>
                      <th className="px-4 py-3 text-gray-400 font-medium text-right">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr
                        key={item.productId}
                        className="border-t border-neutral-border"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-800 shrink-0">
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Link
                              to={`/products/${item.productId}`}
                              className="text-white hover:text-primary transition-colors font-medium"
                            >
                              {item.product.name}
                            </Link>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-300 text-center">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-gray-300 text-right">
                          ${item.unitPrice}
                        </td>
                        <td className="px-4 py-3 text-white text-right font-medium">
                          ${item.lineTotal}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t border-neutral-border pt-4 space-y-2">
              {order.totalPrice != null && Number(order.totalPrice) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">${order.totalPrice}</span>
                </div>
              )}
              {order.tax != null && Number(order.tax) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tax</span>
                  <span className="text-white">${order.tax}</span>
                </div>
              )}
              {order.shipping != null && Number(order.shipping) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-white">${order.shipping}</span>
                </div>
              )}
              {order.discount != null && Number(order.discount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Discount</span>
                  <span className="text-white">-${order.discount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-white pt-2">
                <span>Total</span>
                <span>${order.total}</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Payment
              </p>
              <p className="text-white">
                {formatPaymentMethod(order.paymentMethod)}
              </p>
            </div>

            {order.shippingAddress && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Shipping Address
                </p>
                <p className="text-gray-300">{order.shippingAddress}</p>
              </div>
            )}

            {(order.deliveryDate || order.deliveryTime) && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Delivery
                </p>
                <p className="text-gray-300">
                  {order.deliveryDate &&
                    new Date(order.deliveryDate).toLocaleDateString()}
                  {order.deliveryTime && ` at ${order.deliveryTime}`}
                </p>
              </div>
            )}

            {order.deliveryInstructions &&
              order.deliveryInstructions !== "None" && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Instructions
                  </p>
                  <p className="text-gray-300">{order.deliveryInstructions}</p>
                </div>
              )}
          </div>
        </div>
      </main>
    </AppShell>
  );
}
