import { X } from "lucide-react";

export type CartItem = {
  productId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  productName?: string;
};

type CartSummaryProps = {
  items: CartItem[];
  totalPrice: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  onRemove?: (productId: string) => void;
};

export function CartSummary({
  items,
  totalPrice,
  tax,
  shipping,
  discount,
  total,
  onRemove,
}: CartSummaryProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-3">
      <h3 className="font-semibold text-white">Order summary</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.productId}
            className="flex items-center gap-3 text-sm"
          >
            <span className="text-gray-300 min-w-0 flex-1 truncate uppercase">
              {item.productName ?? item.productId.slice(0, 8)} × {item.quantity}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-white tabular-nums">${item.lineTotal.toFixed(2)}</span>
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(item.productId)}
                  className="p-1 -m-1 text-gray-400 hover:text-red-400 transition-colors rounded"
                  aria-label="Remove"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="border-t border-white/10 pt-3 space-y-1 text-sm">
        <div className="flex justify-between text-gray-400">
          <span>Subtotal</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-gray-400">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-white pt-2">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
