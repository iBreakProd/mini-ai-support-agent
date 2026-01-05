export type OrderRow = {
  orders: {
    id: string;
    shippingStatus: string;
    total: string;
    createdAt: string;
    paymentMethod: string;
  };
  order_items: {
    productId: string;
    quantity: number;
    unitPrice: string;
    lineTotal: string;
  };
};

export function groupOrdersByOrderId<T extends OrderRow>(rows: T[]) {
  const map = new Map<
    string,
    { order: T["orders"]; items: T["order_items"][] }
  >();
  for (const row of rows) {
    const id = row.orders.id;
    if (!map.has(id)) map.set(id, { order: row.orders, items: [] });
    map.get(id)!.items.push(row.order_items);
  }
  return Array.from(map.values());
}
