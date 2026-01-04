import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import api from "@/lib/api";
import { AppShell } from "@/components/layout/AppShell";
import { Modal } from "@/components/ui/Modal";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CreateProductForm } from "@/components/product/CreateProductForm";

export function ProductsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data.data;
    },
  });

  if (isLoading)
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center">
          Loading products…
        </div>
      </AppShell>
    );
  if (isError)
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center text-red-400">
          {error?.message}
        </div>
      </AppShell>
    );

  return (
    <AppShell>
      <main className="lg:pl-20 min-h-screen bg-grid-pattern p-4 md:p-8 lg:pl-24 lg:pr-8">
        <div className="max-w-5xl mx-auto pt-12">
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-none tracking-tighter mb-4">
                OUR
                <br />
                <span className="text-outline">COLLECTION</span>
              </h1>
              <p className="max-w-xl text-gray-400 text-lg md:text-xl font-light leading-relaxed border-l-2 border-primary pl-6">
                Precision-engineered hydration vessels. Crafted for the modern minimalist.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark shrink-0 transition-colors"
            >
              <Plus className="size-5" />
              Add product
            </button>
          </div>
          <Modal
            open={showCreate}
            onClose={() => setShowCreate(false)}
            title="Add product"
          >
            <CreateProductForm onSuccess={() => setShowCreate(false)} />
          </Modal>
          <ProductGrid products={data ?? []} />
        </div>
      </main>
    </AppShell>
  );
}
