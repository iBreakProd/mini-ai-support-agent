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
            className="flex justify-between items-center text-sm"
          >
            <span className="text-gray-300">
              {item.productName ?? item.productId.slice(0, 8)} × {item.quantity}
            </span>
            <span className="text-white">${item.lineTotal.toFixed(2)}</span>
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(item.productId)}
                className="text-red-400 hover:text-red-300 text-xs ml-2"
              >
                Remove
              </button>
            )}
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
