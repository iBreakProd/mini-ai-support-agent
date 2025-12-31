import { db } from "@repo/db";
import { ordersTable, orderItemsTable } from "@repo/db/schema";
import { createOrderSchema } from "@repo/zod";
import { Request, Response } from "express";
import { AppError } from "../utils/errorClasses";
import { PgTransaction } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";

export const getAllOrders = async (_req: Request, res: Response) => {
  const orders = await db
    .select()
    .from(ordersTable)
    .innerJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.orderId));

  res.status(200).json({ success: true, data: orders });
};

export const createOrder = async (req: Request, res: Response) => {
  const inputs = createOrderSchema.safeParse(req.body);

  if (!inputs.success) {
    throw new AppError("Invalid inputs", 400);
  }

  const [order, orderItems] = await db.transaction(
    async (tx: PgTransaction<typeof db.schema>) => {
      const [order] = await tx
        .insert(ordersTable)
        .values({
          shippingAddress: inputs.data.shippingAddress,
          shippingStatus: inputs.data.shippingStatus,
          deliveryDate: inputs.data.deliveryDate,
          deliveryTime: inputs.data.deliveryTime,
          deliveryInstructions: inputs.data.deliveryInstructions,
          paymentStatus: inputs.data.paymentStatus,
          paymentMethod: inputs.data.paymentMethod,
          paymentDate: inputs.data.paymentDate,
          totalPrice: inputs.data.totalPrice.toString(),
          tax: inputs.data.tax.toString(),
          shipping: inputs.data.shipping.toString(),
          discount: inputs.data.discount.toString(),
          total: inputs.data.total.toString(),
        })
        .returning();

      if (!order) {
        throw new AppError("Failed to create order", 500);
      }

      const [orderItems] = await tx
        .insert(orderItemsTable)
        .values(
          inputs.data.products.map(
            ({
              productId,
              quantity,
              unitPrice,
              lineTotal,
            }: {
              productId: string;
              quantity: number;
              unitPrice: number;
              lineTotal: number;
            }) => ({
              orderId: order.id,
              productId,
              quantity,
              unitPrice: unitPrice.toString(),
              lineTotal: lineTotal.toString(),
            })
          )
        )
        .returning();

      if (!orderItems) {
        throw new AppError("Failed to create order items", 500);
      }

      return [order, orderItems];
    }
  );

  res.status(201).json({ success: true, data: { order, orderItems } });
};
