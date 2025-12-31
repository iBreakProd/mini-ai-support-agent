import {
  uuid,
  text,
  pgEnum,
  timestamp,
  serial,
  pgTable,
  numeric,
  integer,
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
  description: text().notNull(),
  price: numeric().notNull(),
  imageUrl: text().notNull(),
  seller: text().notNull(),
  sellerEmail: text().notNull(),
  sellerRating: numeric().notNull(),
  sellerReviews: text().array().notNull(),
  category: text().notNull(),
  subCategory: text().notNull(),
  rating: numeric().notNull(),
  reviews: text().array().notNull(),
  createdAt: timestamp().defaultNow(),
});

export const ordersTable = pgTable("orders", {
  id: uuid().primaryKey().defaultRandom(),
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

export const orderItemsTable = pgTable("order_items", {
  id: uuid().primaryKey().defaultRandom(),
  orderId: uuid()
    .notNull()
    .references(() => ordersTable.id, { onDelete: "cascade" }),
  productId: uuid()
    .notNull()
    .references(() => productsTable.id, { onDelete: "cascade" }),
  quantity: integer().notNull().default(1),
  unitPrice: numeric().notNull(),
  lineTotal: numeric().notNull(),
  createdAt: timestamp().defaultNow(),
});
