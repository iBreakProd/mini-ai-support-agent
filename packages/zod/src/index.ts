import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  price: z.number().min(0),
  imageUrl: z.string().trim().min(1),
  seller: z.string().trim().min(1),
  sellerEmail: z.string().email(),
  sellerRating: z.number().min(0).max(5),
  sellerReviews: z.array(z.string().trim()).min(1),
  category: z.string().trim().min(1),
  subCategory: z.string().trim().min(1),
  rating: z.number().min(0).max(5),
  reviews: z.array(z.string().trim()).min(1),
});

export const createOrderSchema = z.object({
  products: z
    .array(
      z.object({
        productId: z.string().trim().min(1),
        quantity: z.number().min(1),
        unitPrice: z.number().min(0),
        lineTotal: z.number().min(0),
      })
    )
    .min(1),
  shippingAddress: z.string().trim().min(1),
  shippingStatus: z.string().trim().min(1),
  deliveryDate: z.coerce.date(),
  deliveryTime: z.string().trim().min(1),
  deliveryInstructions: z.string().trim().min(1),
  paymentStatus: z.string().trim().min(1),
  paymentMethod: z.string().trim().min(1),
  paymentDate: z.coerce.date(),
  totalPrice: z.number().min(0),
  tax: z.number().min(0),
  shipping: z.number().min(0),
  discount: z.number().min(0),
  total: z.number().min(0),
});

export const messageSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1)
    .max(1000, "Message must be less than 1000 characters"),
  conversationId: z.string().optional().nullable(),
});

export const aiResponseSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("answer"), response: z.string() }),
  z.object({
    type: z.literal("ambiguity"),
    response: z.string(),
    id_array: z.array(z.string()).max(4),
    resourceType: z.enum(["product", "order"]),
  }),
]);

export const userProfileSchema = z.object({
  activityLevel: z.enum(["sedentary", "moderate", "active"]),
  climate: z.enum(["dry", "humid", "temperate"]),
  dietaryPreference: z.string().trim().optional(),
  hydrationGoal: z.string().trim().optional(),
});

export const signupSchema = z.object({
  name: z.string().trim().min(1),
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  imageUrl: z.url().optional(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required"),
});