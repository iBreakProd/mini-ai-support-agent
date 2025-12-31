import { db } from "@repo/db";
import { eq } from "drizzle-orm";
import { productsTable } from "@repo/db/schema";

export const getProductById = async (productId: string) => {
  const product = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, productId));
  return product;
};

export const listAllProducts = async () => {
  const products = await db.select().from(productsTable);
  return products;
};
