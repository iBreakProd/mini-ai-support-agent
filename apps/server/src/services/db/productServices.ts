import { db } from "@repo/db";
import { and, eq, gte, ilike, lte, or } from "drizzle-orm";
import { productsTable } from "@repo/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type Product = InferSelectModel<typeof productsTable>;

export const getProductCatalogSummary = async () => {
  const products = await db.select().from(productsTable);
  const categories = [...new Set(products.map((p: Product) => p.category))].sort();
  const subCategories = [...new Set(products.map((p: Product) => p.subCategory))].sort();
  const prices = products.map((p: Product) => parseFloat(p.price));
  return {
    categories,
    subCategories,
    priceRange: {
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 0,
    },
    totalProducts: products.length,
  };
};

type SearchProductsParams = {
  query?: string;
  category?: string;
  subCategory?: string;
  maxPrice?: number;
  minPrice?: number;
  limit?: number;
};

export const searchProducts = async (params: SearchProductsParams = {}) => {
  const { query, category, subCategory, maxPrice, minPrice, limit = 10 } = params;
  const conditions = [];

  if (query?.trim()) {
    const searchTerm = `%${query.trim()}%`;
    conditions.push(
      or(
        ilike(productsTable.name, searchTerm),
        ilike(productsTable.description, searchTerm)
      )
    );
  }

  if (category?.trim()) {
    conditions.push(ilike(productsTable.category, `%${category.trim()}%`));
  }
  if (subCategory?.trim()) {
    conditions.push(
      ilike(productsTable.subCategory, `%${subCategory.trim()}%`)
    );
  }
  if (typeof minPrice === "number" && minPrice >= 0) {
    conditions.push(gte(productsTable.price, String(minPrice)));
  }
  if (typeof maxPrice === "number" && maxPrice >= 0) {
    conditions.push(lte(productsTable.price, String(maxPrice)));
  }

  const baseQuery = db.select().from(productsTable);
  const filtered =
    conditions.length > 0
      ? baseQuery.where(and(...conditions))
      : baseQuery;
  return filtered.limit(Math.min(Math.max(limit, 1), 50));
};

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
