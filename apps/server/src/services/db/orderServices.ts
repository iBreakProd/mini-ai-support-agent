import { db } from "@repo/db";
import { eq } from "drizzle-orm";
import { ordersTable } from "@repo/db/schema";

export const getOrderById = async (orderId: string) => {
  const order = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, orderId));
  return order;
};

export const listAllOrders = async () => {
  const orders = await db.select().from(ordersTable);
  return orders;
};
