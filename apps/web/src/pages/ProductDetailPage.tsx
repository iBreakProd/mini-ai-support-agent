import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronRight,
  Star,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  Leaf,
  Recycle,
} from "lucide-react";
import api from "@/lib/api";
import { AppShell } from "@/components/layout/AppShell";

type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  category: string;
  subCategory: string;
  rating: string;
  reviews: string[];
};

function StarRating({ rating }: { rating: string }) {
  const r = parseFloat(rating) || 0;
  const full = Math.floor(r);
  const half = r % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex text-primary gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f-${i}`} className="size-4 fill-primary" />
      ))}
      {half && <Star key="h" className="size-4 fill-primary/50" />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e-${i}`} className="size-4" />
      ))}
    </div>
  );
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, isError, error } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await api.get<{ data: Product }>(`/products/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (!product) return;
    navigate("/orders", {
      state: { addProduct: { productId: product.id, quantity } },
    });
  };

  if (isLoading)
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center">
          Loading…
        </div>
      </AppShell>
    );

  if (isError || !product) {
    return (
      <AppShell>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-red-400">
            {error instanceof Error ? error.message : "Product not found"}
          </p>
          <Link
            to="/products"
            className="text-primary hover:underline font-semibold"
          >
            Back to products
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <main className="lg:pl-24 min-h-screen bg-grid-pattern p-4 md:p-8 lg:pr-8">
        <div className="max-w-5xl mx-auto pt-24 lg:pt-12">
          <div className="flex items-center text-xs tracking-widest text-gray-500 uppercase mb-8">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="size-4 mx-2" />
            <Link to="/products" className="hover:text-primary transition-colors">
              Products
            </Link>
            <ChevronRight className="size-4 mx-2" />
            <span className="text-white">{product.name}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
            <div className="w-full lg:w-1/2 flex flex-col gap-4">
              <div className="relative aspect-[4/5] w-full rounded-lg overflow-hidden border border-neutral-border group bg-neutral-900/40">
                <div className="absolute inset-0 bg-grain opacity-20 z-10 pointer-events-none" />
                <div className="absolute top-4 left-4 z-20">
                  <span className="bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    In Stock
                  </span>
                </div>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background-dark/80 via-transparent to-transparent opacity-40 z-10" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-square rounded-lg overflow-hidden border border-neutral-border bg-neutral-900/40 group">
                  <img
                    src={product.imageUrl}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="relative aspect-square rounded-lg overflow-hidden border border-neutral-border bg-neutral-900/40 group">
                  <img
                    src={product.imageUrl}
                    alt=""
                    className="w-full h-full object-cover grayscale-[30%] group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              <div className="mb-2">
                <span className="text-primary font-bold tracking-[0.2em] text-sm uppercase">
                  {product.category}
                </span>
              </div>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tighter mb-4 text-white">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-8">
                <span className="text-3xl font-light text-white">
                  ${product.price}
                </span>
                <StarRating rating={product.rating} />
                <span className="text-gray-500 text-sm">
                  ({product.reviews?.length ?? 0} Reviews)
                </span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed mb-8 border-l-2 border-primary/50 pl-6">
                {product.description}
              </p>
              <div className="grid grid-cols-2 gap-y-6 gap-x-8 mb-10 text-sm">
                <div>
                  <span className="block text-gray-500 text-xs uppercase tracking-widest mb-1">
                    Material
                  </span>
                  <span className="text-white font-medium">{product.category}</span>
                </div>
                <div>
                  <span className="block text-gray-500 text-xs uppercase tracking-widest mb-1">
                    Capacity
                  </span>
                  <span className="text-white font-medium">
                    {product.subCategory}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-500 text-xs uppercase tracking-widest mb-1">
                    Insulation
                  </span>
                  <span className="text-white font-medium">
                    24h Cold / 12h Hot
                  </span>
                </div>
                <div>
                  <span className="block text-gray-500 text-xs uppercase tracking-widest mb-1">
                    Weight
                  </span>
                  <span className="text-white font-medium">Ultra-light</span>
                </div>
              </div>
              <div className="bg-neutral-900/50 border border-neutral-border p-6 rounded-lg mb-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center border border-neutral-border rounded bg-black/20">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="w-12 h-10 flex items-center justify-center text-white font-bold text-sm">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs text-green-400 mb-1 flex items-center justify-end gap-1">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      In Stock, Ready to Ship
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold uppercase tracking-widest py-4 px-8 rounded transition-all duration-300 shadow-[0_0_20px_rgba(48,140,232,0.3)] hover:shadow-[0_0_30px_rgba(48,140,232,0.5)]"
                  >
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    className="border border-neutral-border hover:border-white text-white font-bold uppercase tracking-widest py-4 px-6 rounded transition-all duration-300 flex items-center justify-center"
                  >
                    <Heart className="size-5" />
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-primary" />
                  Key Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 border border-neutral-border divide-y md:divide-y-0 md:divide-x divide-neutral-border bg-neutral-900/30">
                  <div className="p-4 flex flex-col items-center text-center gap-2 group hover:bg-white/5 transition-colors">
                    <ShieldCheck className="size-8 text-primary mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-white font-bold text-xs uppercase tracking-wider">
                      Antimicrobial
                    </span>
                  </div>
                  <div className="p-4 flex flex-col items-center text-center gap-2 group hover:bg-white/5 transition-colors">
                    <Leaf className="size-8 text-primary mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-white font-bold text-xs uppercase tracking-wider">
                      BPA Free
                    </span>
                  </div>
                  <div className="p-4 flex flex-col items-center text-center gap-2 group hover:bg-white/5 transition-colors">
                    <Recycle className="size-8 text-primary mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-white font-bold text-xs uppercase tracking-wider">
                      Eco-Friendly
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
