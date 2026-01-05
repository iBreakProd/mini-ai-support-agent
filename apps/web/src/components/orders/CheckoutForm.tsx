import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { CartSummary, type CartItem } from "./CartSummary";

export type ProductOption = {
  id: string;
  name: string;
  price: string;
};

type CheckoutFormProps = {
  products: ProductOption[];
  initialCart?: CartItem[];
  onSuccess?: () => void;
};

export function CheckoutForm({ products, initialCart, onSuccess }: CheckoutFormProps) {
  const [cart, setCart] = useState<CartItem[]>(() => initialCart ?? []);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [shippingAddress, setShippingAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("12:00");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [tax, setTax] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [discount, setDiscount] = useState(0);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (body: Record<string, unknown>) => api.post("/orders", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setCart([]);
      onSuccess?.();
    },
  });

  const totalPrice = cart.reduce((sum, i) => sum + i.lineTotal, 0);
  const total = totalPrice + tax + shippingCost - discount;

  const cartItemsWithNames: CartItem[] = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return { ...item, productName: product?.name };
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;
    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;
    const unitPrice = Number.parseFloat(product.price);
    const quantity = Math.max(1, selectedQuantity);
    const lineTotal = unitPrice * quantity;
    const existing = cart.find((i) => i.productId === selectedProductId);
    if (existing) {
      setCart((c) =>
        c.map((i) =>
          i.productId === selectedProductId
            ? {
                ...i,
                quantity: i.quantity + quantity,
                lineTotal: i.lineTotal + lineTotal,
              }
            : i
        )
      );
    } else {
      setCart((c) => [
        ...c,
        {
          productId: selectedProductId,
          quantity,
          unitPrice,
          lineTotal,
        },
      ]);
    }
    setSelectedProductId("");
    setSelectedQuantity(1);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((c) => c.filter((i) => i.productId !== productId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    const now = new Date();
    const body = {
      products: cart.map(({ productId, quantity, unitPrice, lineTotal }) => ({
        productId,
        quantity,
        unitPrice,
        lineTotal,
      })),
      shippingAddress,
      shippingStatus: "pending",
      deliveryDate: deliveryDate || now.toISOString().slice(0, 10),
      deliveryTime: deliveryTime || "12:00",
      deliveryInstructions: deliveryInstructions || "None",
      paymentStatus: "pending",
      paymentMethod: "card",
      paymentDate: now.toISOString(),
      totalPrice,
      tax,
      shipping: shippingCost,
      discount,
      total,
    };
    mutation.mutate(body);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {mutation.isError && (
        <p className="text-sm text-red-400">{mutation.error?.message}</p>
      )}
      {mutation.isSuccess && (
        <p className="text-sm text-green-400">Order placed!</p>
      )}
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <h4 className="font-semibold text-white mb-3">Add products</h4>
        <div className="flex gap-2 flex-wrap">
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="px-4 py-2 rounded-lg border border-neutral-border bg-background-dark text-white flex-1 min-w-[200px]"
          >
            <option value="">Select product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} – ${p.price}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            placeholder="Qty"
            value={selectedQuantity}
            onChange={(e) =>
              setSelectedQuantity(Number(e.target.value) || 1)
            }
            className="w-20 px-4 py-2 rounded-lg border border-neutral-border bg-background-dark text-white"
          />
          <button
            type="button"
            onClick={handleAddToCart}
            className="px-4 py-2 rounded-lg bg-primary text-white font-bold"
          >
            Add
          </button>
        </div>
      </div>
      {cart.length > 0 && (
        <CartSummary
          items={cartItemsWithNames}
          totalPrice={totalPrice}
          tax={tax}
          shipping={shippingCost}
          discount={discount}
          total={total}
          onRemove={handleRemoveFromCart}
        />
      )}
      <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-4">
        <h4 className="font-semibold text-white">Shipping</h4>
        <textarea
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          placeholder="Shipping address"
          required
          rows={2}
          className="w-full px-4 py-2 rounded-lg border border-neutral-border bg-background-dark text-white"
        />
        <div className="flex gap-4 flex-wrap">
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            required
            className="px-4 py-2 rounded-lg border border-neutral-border bg-background-dark text-white"
          />
          <input
            type="time"
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
            required
            className="px-4 py-2 rounded-lg border border-neutral-border bg-background-dark text-white [color-scheme:dark]"
          />
        </div>
        <input
          type="text"
          value={deliveryInstructions}
          onChange={(e) => setDeliveryInstructions(e.target.value)}
          placeholder="Delivery instructions (e.g. Leave at door)"
          required
          className="w-full px-4 py-2 rounded-lg border border-neutral-border bg-background-dark text-white"
        />
      </div>
      <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-4">
        <h4 className="font-semibold text-white">Adjustments</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Tax ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={tax}
              onChange={(e) => setTax(Number(e.target.value) || 0)}
              className="w-full px-4 py-2 rounded-lg border border-neutral-border bg-background-dark text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Shipping ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={shippingCost}
              onChange={(e) =>
                setShippingCost(Number(e.target.value) || 0)
              }
              className="w-full px-4 py-2 rounded-lg border border-neutral-border bg-background-dark text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Discount ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value) || 0)}
              className="w-full px-4 py-2 rounded-lg border border-neutral-border bg-background-dark text-white"
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        disabled={mutation.isPending || cart.length === 0}
        className="w-full py-3 rounded-lg bg-primary text-white font-bold disabled:opacity-50"
      >
        {mutation.isPending ? "Placing order…" : "Place order"}
      </button>
    </form>
  );
}
