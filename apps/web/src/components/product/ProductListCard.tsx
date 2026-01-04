import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export type ProductListItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  rating: string;
  category?: string;
  subCategory?: string;
};

const BADGE_STYLES: Record<string, string> = {
  titanium: "bg-primary/20 border-primary/30 text-primary",
  copper: "bg-orange-500/20 border-orange-500/30 text-orange-400",
  midnight: "bg-purple-500/20 border-purple-500/30 text-purple-400",
  ceramic: "bg-white/10 border-white/20 text-white",
  insulated: "bg-blue-500/20 border-blue-500/30 text-blue-400",
  limited: "bg-green-500/20 border-green-500/30 text-green-400",
};

function getBadgeStyle(category: string): string {
  if (!category) return "bg-primary/20 border-primary/30 text-primary";
  const key = category.toLowerCase().replace(/\s+/g, "");
  return BADGE_STYLES[key] ?? "bg-primary/20 border-primary/30 text-primary";
}

export function ProductListCard({ product }: { product: ProductListItem }) {
  const badgeStyle = getBadgeStyle(product.category);

  return (
    <Link to={`/products/${product.id}`} className="group product-card-hover relative block">
      <div className="bg-neutral-800/30 border border-neutral-border rounded-lg overflow-hidden h-[500px] relative mb-4">
        <div className="absolute inset-0 bg-grain opacity-20 z-10 pointer-events-none" />
        <div className={`absolute top-4 right-4 z-20 backdrop-blur-md border rounded-full text-[10px] font-bold px-3 py-1 uppercase tracking-widest ${badgeStyle}`}>
          {product.category ?? "Product"}
        </div>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-img w-full h-full object-cover transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background-dark via-transparent to-transparent opacity-80 z-10" />
        <div className="absolute bottom-6 left-6 z-20">
          <h3 className="text-3xl font-bold text-white mb-1">{product.name}</h3>
          <p className="text-sm text-gray-400 font-mono">{product.subCategory ?? product.description?.slice(0, 40) ?? ""}</p>
        </div>
      </div>
      <div className="flex justify-between items-center px-2">
        <span className="text-lg font-bold text-white">${product.price}</span>
        <span className="text-xs font-bold uppercase tracking-widest text-primary group-hover:text-white transition-colors flex items-center gap-1 group-hover:gap-2 duration-300">
          View Details
          <ArrowRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}
