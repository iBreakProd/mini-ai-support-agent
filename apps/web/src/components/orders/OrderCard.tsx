import { useState } from "react";
import { Link } from "react-router-dom";
import { HelpCircle, FileText } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

export type ProductForOrder = {
  id: string;
  name: string;
  imageUrl: string;
  subCategory: string;
  category?: string;
};

type OrderItem = {
  productId: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
};

type OrderRow = {
  order: {
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

export function OrderCard({ row, products }: { row: OrderRow; products: ProductForOrder[] }) {
  const { order, items } = row;
  const [showDetails, setShowDetails] = useState(false);

  const firstItem = items[0];
  const firstProduct = firstItem ? products.find((p) => p.id === firstItem.productId) : null;
  const imageUrl = firstProduct?.imageUrl ?? "/images/products/B-1.png";
  const categoryBadge = firstProduct?.category ?? firstProduct?.subCategory ?? "Product";

  const itemsList = items.map((item) => {
    const p = products.find((pr) => pr.id === item.productId);
    return `${item.quantity}x ${p?.name ?? "Product"}`;
  });

  const shortId = order.id.replace(/-/g, "").slice(-8).toUpperCase();
  const placedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <div className="glass-panel p-6 md:p-8 rounded-lg group hover:border-primary/50 transition-colors duration-500 relative overflow-hidden">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="w-full md:w-40 aspect-square bg-neutral-900 rounded-lg border border-neutral-border overflow-hidden relative shrink-0">
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10" />
            <img
              src={imageUrl}
              alt={firstProduct?.name ?? "Product"}
              className="w-full h-full object-cover mix-blend-overlay opacity-80 group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute bottom-2 left-2 z-20">
              <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded font-bold uppercase">
                {categoryBadge}
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-4">
            <div>
              <p className="text-sm font-mono font-bold text-white">#ORD-{shortId}</p>
              <p className="text-xs text-gray-500 mt-0.5">{placedDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Items</p>
              <p className="text-sm text-gray-200">{itemsList.join(" · ")}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total</p>
              <p className="text-lg font-bold text-white">${order.total}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Paid via {formatPaymentMethod(order.paymentMethod)}
              </p>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowDetails(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-neutral-border hover:border-primary hover:bg-primary/10 text-white text-sm font-semibold transition-all"
            >
              <FileText className="size-4" />
              View Details
            </button>
            <Link
              to="/support"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-neutral-border hover:border-primary hover:bg-primary/10 text-white text-sm font-semibold transition-all"
            >
              <HelpCircle className="size-4" />
              Help
            </Link>
          </div>
        </div>
      </div>

      <Modal
        open={showDetails}
        onClose={() => setShowDetails(false)}
        title={`Order #ORD-${shortId}`}
      >
        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date</p>
            <p className="text-white">{placedDate}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Items</p>
            <div className="border border-neutral-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/5 text-left">
                    <th className="px-4 py-3 text-gray-400 font-medium">Product</th>
                    <th className="px-4 py-3 text-gray-400 font-medium text-right">Qty</th>
                    <th className="px-4 py-3 text-gray-400 font-medium text-right">Unit Price</th>
                    <th className="px-4 py-3 text-gray-400 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const p = products.find((pr) => pr.id === item.productId);
                    return (
                      <tr key={item.productId} className="border-t border-neutral-border">
                        <td className="px-4 py-3 text-white">{p?.name ?? "Product"}</td>
                        <td className="px-4 py-3 text-gray-300 text-right">{item.quantity}</td>
                        <td className="px-4 py-3 text-gray-300 text-right">${item.unitPrice}</td>
                        <td className="px-4 py-3 text-white text-right font-medium">${item.lineTotal}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-neutral-border pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-white">
                ${items.reduce((sum, i) => sum + Number.parseFloat(i.lineTotal), 0).toFixed(2)}
              </span>
            </div>
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
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Payment</p>
            <p className="text-white">{formatPaymentMethod(order.paymentMethod)}</p>
          </div>

          {order.shippingAddress && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Shipping Address</p>
              <p className="text-gray-300">{order.shippingAddress}</p>
            </div>
          )}

          {(order.deliveryDate || order.deliveryTime) && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Delivery</p>
              <p className="text-gray-300">
                {order.deliveryDate && new Date(order.deliveryDate).toLocaleDateString()}
                {order.deliveryTime && ` at ${order.deliveryTime}`}
              </p>
            </div>
          )}

          {order.deliveryInstructions && order.deliveryInstructions !== "None" && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Instructions</p>
              <p className="text-gray-300">{order.deliveryInstructions}</p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
