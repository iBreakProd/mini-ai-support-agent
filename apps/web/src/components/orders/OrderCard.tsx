type OrderItem = {
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
  };
  items: OrderItem[];
};

export function OrderCard({ row }: { row: OrderRow }) {
  const { order, items } = row;
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <div className="flex justify-between">
        <span className="text-gray-400">Order #{order.id.slice(0, 8)}</span>
        <span className="text-primary font-medium">{order.shippingStatus}</span>
      </div>
      <p className="text-sm text-gray-400 mt-1">
        {new Date(order.createdAt).toLocaleDateString()}
      </p>
      <p className="text-white font-bold mt-2">
        ${order.total} · {itemCount} items
      </p>
    </div>
  );
}
