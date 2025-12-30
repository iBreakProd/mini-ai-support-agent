CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"productId" uuid NOT NULL,
	"shippingAddress" text NOT NULL,
	"shippingStatus" text NOT NULL,
	"deliveryDate" timestamp NOT NULL,
	"deliveryTime" text NOT NULL,
	"deliveryInstructions" text NOT NULL,
	"paymentStatus" text NOT NULL,
	"paymentMethod" text NOT NULL,
	"paymentDate" timestamp NOT NULL,
	"totalPrice" numeric NOT NULL,
	"tax" numeric NOT NULL,
	"shipping" numeric NOT NULL,
	"discount" numeric NOT NULL,
	"total" numeric NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"rating" numeric NOT NULL,
	"reviews" text[] NOT NULL,
	"seller" text NOT NULL,
	"sellerEmail" text NOT NULL,
	"sellerRating" numeric NOT NULL,
	"sellerReviews" text[] NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"subCategory" text NOT NULL,
	"tags" text[] NOT NULL,
	"price" numeric NOT NULL,
	"imageUrl" text NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;