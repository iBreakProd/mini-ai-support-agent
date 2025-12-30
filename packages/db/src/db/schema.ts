import {
  uuid,
  text,
  pgEnum,
  timestamp,
  serial,
  pgTable,
  numeric,
} from "drizzle-orm/pg-core";

export const conversationsTable = pgTable("conversation", {
  id: uuid().primaryKey().defaultRandom(),
  createdAt: timestamp().defaultNow(),
});

export const senderEnum = pgEnum("sender", ["user", "ai"]);

export const messagesTable = pgTable("messages", {
  id: serial().primaryKey(),
  text: text().notNull(),
  sender: senderEnum().notNull(),
  createdAt: timestamp().defaultNow(),
  conversationId: uuid()
    .notNull()
    .references(() => conversationsTable.id, { onDelete: "cascade" }),
});

export const productsTable = pgTable("products", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  rating: numeric().notNull(),
  reviews: text().array().notNull(),
  seller: text().notNull(),
  sellerEmail: text().notNull(),
  sellerRating: numeric().notNull(),
  sellerReviews: text().array().notNull(),
  description: text().notNull(),
  category: text().notNull(),
  subCategory: text().notNull(),
  tags: text().array().notNull(),
  price: numeric().notNull(),
  imageUrl: text().notNull(),
  createdAt: timestamp().defaultNow(),
});

export const ordersTable = pgTable("orders", {
  id: uuid().primaryKey().defaultRandom(),
  productId: uuid()
    .notNull()
    .references(() => productsTable.id, { onDelete: "cascade" }),
  shippingAddress: text().notNull(),
  shippingStatus: text().notNull(),
  deliveryDate: timestamp().notNull(),
  deliveryTime: text().notNull(),
  deliveryInstructions: text().notNull(),
  paymentStatus: text().notNull(),
  paymentMethod: text().notNull(),
  paymentDate: timestamp().notNull(),
  totalPrice: numeric().notNull(),
  tax: numeric().notNull(),
  shipping: numeric().notNull(),
  discount: numeric().notNull(),
  total: numeric().notNull(),
  createdAt: timestamp().defaultNow(),
});
