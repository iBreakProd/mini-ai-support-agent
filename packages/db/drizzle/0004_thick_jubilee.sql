ALTER TABLE "orders" DROP CONSTRAINT "orders_orderItemsId_order_items_id_fk";
--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "orderId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "orderItemsId";