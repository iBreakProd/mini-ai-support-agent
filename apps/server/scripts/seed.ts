import "dotenv/config";
import { db } from "@repo/db";
import { productsTable } from "@repo/db/schema";

const SAMPLE_PRODUCTS = [
  {
    name: "TITAN X-1",
    description:
      "Aerospace-grade titanium hydration vessel. Lightweight, durable, and designed for the modern minimalist. Superior thermal performance.",
    price: "120.00",
    imageUrl: "/images/products/B-1.png",
    seller: "Artistic Grid Co.",
    sellerEmail: "contact@artisticgrid.com",
    sellerRating: "5",
    sellerReviews: ["Exceptional quality", "Fast shipping"],
    category: "Titanium",
    subCategory: "Aerospace Grade / 750ml",
    rating: "5",
    reviews: ["Incredible bottle", "Worth every penny"],
  },
  {
    name: "COPPER CORE",
    description:
      "Antimicrobial copper interior with a sleek exterior. Natural purification properties and timeless design.",
    price: "95.00",
    imageUrl: "/images/products/B-2.png",
    seller: "Artistic Grid Co.",
    sellerEmail: "contact@artisticgrid.com",
    sellerRating: "5",
    sellerReviews: ["Beautiful craftsmanship", "Great customer service"],
    category: "Copper",
    subCategory: "Antimicrobial / 500ml",
    rating: "5",
    reviews: ["Love the copper finish", "Keeps water cold for hours"],
  },
  {
    name: "MIDNIGHT OPS",
    description:
      "Stealth matte black finish. Maximum capacity with a sleek, understated profile. Perfect for any setting.",
    price: "85.00",
    imageUrl: "/images/products/B-3.png",
    seller: "Artistic Grid Co.",
    sellerEmail: "contact@artisticgrid.com",
    sellerRating: "5",
    sellerReviews: ["Top tier seller", "On-time delivery"],
    category: "Midnight",
    subCategory: "Stealth Matte / 1000ml",
    rating: "5",
    reviews: ["Best bottle I own", "Sleek and durable"],
  },
  {
    name: "ALABASTER",
    description:
      "Soft-touch ceramic exterior. Elegant and refined. A statement piece for desk or travel.",
    price: "75.00",
    imageUrl: "/images/products/B-4.png",
    seller: "Artistic Grid Co.",
    sellerEmail: "contact@artisticgrid.com",
    sellerRating: "5",
    sellerReviews: ["Excellent packaging", "As described"],
    category: "Ceramic",
    subCategory: "Soft Touch / 750ml",
    rating: "5",
    reviews: ["Gorgeous design", "Very satisfied"],
  },
  {
    name: "CHROME SERIES",
    description:
      "Triple-wall vacuum insulation. Brushed steel finish. Keeps drinks cold for 24 hours or hot for 12.",
    price: "110.00",
    imageUrl: "/images/products/B-5.png",
    seller: "Artistic Grid Co.",
    sellerEmail: "contact@artisticgrid.com",
    sellerRating: "5",
    sellerReviews: ["Reliable seller", "Quality product"],
    category: "Insulated",
    subCategory: "Triple Wall / 750ml",
    rating: "5",
    reviews: ["Insulation is amazing", "Stays cold all day"],
  },
  {
    name: "RAW INDUSTRIAL",
    description:
      "Unfinished steel aesthetic. Raw, industrial character. For those who appreciate unfiltered design.",
    price: "145.00",
    imageUrl: "/images/products/B-6.png",
    seller: "Artistic Grid Co.",
    sellerEmail: "contact@artisticgrid.com",
    sellerRating: "5",
    sellerReviews: ["Unique piece", "Great communication"],
    category: "Limited",
    subCategory: "Unfinished Steel / 1000ml",
    rating: "5",
    reviews: ["One of a kind", "Perfect for my desk"],
  },
];

async function seed() {
  try {
    const existing = await db.select().from(productsTable);
    if (existing.length > 0) {
      console.log(
        `Found ${existing.length} existing product(s). Skipping seed to avoid duplicates.`
      );
      console.log("Run with FORCE_SEED=1 to insert anyway.");
      if (process.env.FORCE_SEED !== "1") {
        process.exit(0);
      }
    }

    for (const p of SAMPLE_PRODUCTS) {
      await db.insert(productsTable).values({
        name: p.name,
        description: p.description,
        price: p.price,
        imageUrl: p.imageUrl,
        seller: p.seller,
        sellerEmail: p.sellerEmail,
        sellerRating: p.sellerRating,
        sellerReviews: p.sellerReviews,
        category: p.category,
        subCategory: p.subCategory,
        rating: p.rating,
        reviews: p.reviews,
      });
    }
    console.log(`Seeded ${SAMPLE_PRODUCTS.length} products.`);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();
