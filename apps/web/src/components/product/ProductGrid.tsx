import { ProductListCard, type ProductListItem } from "./ProductListCard";

export function ProductGrid({ products }: { products: ProductListItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
      {products.map((p) => (
        <ProductListCard key={p.id} product={p} />
      ))}
    </div>
  );
}
