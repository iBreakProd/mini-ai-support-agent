import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, X, Package, Store, Star, Check, Sparkles } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContextHook";
import { PRODUCT_IMAGES } from "@/config/productImages";

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-neutral-border bg-background-dark text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-colors";

const labelClass = "block text-sm font-medium text-gray-400 mb-1.5";

export function CreateProductForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const { isAuthenticated } = useAuth();
  const [hasGeneratedDescription, setHasGeneratedDescription] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    imageUrl: PRODUCT_IMAGES[0],
    seller: "",
    sellerEmail: "",
    sellerRating: 5,
    sellerReviews: ["Great seller", "On-time delivery"],
    category: "",
    subCategory: "",
    rating: 5,
    reviews: ["Great product", "Very satisfied"],
  });
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { mutate: submitProduct, isPending } = useMutation({
    mutationFn: (product: typeof form) => api.post("/products", product),
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Failed to create product");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onSuccess?.();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const sellerReviews = form.sellerReviews.filter((r) => r.trim().length > 0);
    const reviews = form.reviews.filter((r) => r.trim().length > 0);
    const payload = {
      ...form,
      sellerReviews: sellerReviews.length > 0 ? sellerReviews : ["Great seller"],
      reviews: reviews.length > 0 ? reviews : ["Great product"],
    };
    submitProduct(payload);
  };

  const addSellerReview = () =>
    setForm((f) => ({ ...f, sellerReviews: [...f.sellerReviews, ""] }));
  const removeSellerReview = (i: number) =>
    setForm((f) => ({
      ...f,
      sellerReviews: f.sellerReviews.filter((_, idx) => idx !== i),
    }));
  const updateSellerReview = (i: number, v: string) =>
    setForm((f) => ({
      ...f,
      sellerReviews: f.sellerReviews.map((r, idx) => (idx === i ? v : r)),
    }));

  const addReview = () =>
    setForm((f) => ({ ...f, reviews: [...f.reviews, ""] }));
  const removeReview = (i: number) =>
    setForm((f) => ({ ...f, reviews: f.reviews.filter((_, idx) => idx !== i) }));
  const updateReview = (i: number, v: string) =>
    setForm((f) => ({
      ...f,
      reviews: f.reviews.map((r, idx) => (idx === i ? v : r)),
    }));

  const handleGenerateDescription = async () => {
    if (!isAuthenticated || hasGeneratedDescription || isGeneratingDescription)
      return;
    setIsGeneratingDescription(true);
    setError(null);
    try {
      const res = await api.post<{ data: { description: string } }>(
        "/products/generate-description",
        {
          name: form.name,
          category: form.category,
          subCategory: form.subCategory,
        }
      );
      setForm((f) => ({
        ...f,
        description: res.data.data.description,
      }));
      setHasGeneratedDescription(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate description"
      );
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      <section className="space-y-4">
        <h4 className="flex items-center gap-2 text-white font-semibold">
          <Package className="size-5 text-primary" />
          Product details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. TITAN X-1"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className={inputClass}
            />
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label className="text-sm font-medium text-gray-400">
                Description
              </label>
              <button
                type="button"
                onClick={handleGenerateDescription}
                title={
                  !isAuthenticated
                    ? "Log in to use this feature"
                    : hasGeneratedDescription
                      ? "Already used for this form"
                      : undefined
                }
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/50 text-primary text-sm font-medium transition-colors ${
                  !isAuthenticated || hasGeneratedDescription
                    ? "opacity-50 cursor-not-allowed"
                    : isGeneratingDescription
                      ? "opacity-70 cursor-wait"
                      : "hover:bg-primary/10"
                }`}
              >
                <Sparkles className="size-4" />
                {isGeneratingDescription ? "Generating..." : "Generate with AI"}
              </button>
            </div>
            <textarea
              name="description"
              placeholder="Aerospace-grade titanium hydration vessel..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={3}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Category (badge)</label>
            <input
              type="text"
              name="category"
              placeholder="e.g. Titanium, Copper, Midnight"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Sub-category</label>
            <input
              type="text"
              name="subCategory"
              placeholder="e.g. Aerospace Grade / 750ml"
              value={form.subCategory}
              onChange={(e) =>
                setForm({ ...form, subCategory: e.target.value })
              }
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Price</label>
            <input
              type="number"
              name="price"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={form.price || ""}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) || 0 })
              }
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Rating (0–5)</label>
            <input
              type="number"
              name="rating"
              min="0"
              max="5"
              step="0.1"
              placeholder="5"
              value={form.rating}
              onChange={(e) =>
                setForm({ ...form, rating: Number(e.target.value) })
              }
              required
              className={inputClass}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Product image</label>
            <p className="text-xs text-gray-500 mb-3">
              Select an image from the gallery below.
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-3">
              {PRODUCT_IMAGES.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setForm({ ...form, imageUrl: src })}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark ${
                    form.imageUrl === src
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-neutral-border hover:border-white/30"
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {form.imageUrl === src && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <Check className="size-6 text-white drop-shadow-lg" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            {form.imageUrl && (
              <p className="mt-2 text-xs text-gray-500 truncate">
                Selected: {form.imageUrl}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4 pt-4 border-t border-neutral-border">
        <h4 className="flex items-center gap-2 text-white font-semibold">
          <Store className="size-5 text-primary" />
          Seller info
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Seller name</label>
            <input
              type="text"
              name="seller"
              placeholder="Artistic Grid Co."
              value={form.seller}
              onChange={(e) => setForm({ ...form, seller: e.target.value })}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Seller email</label>
            <input
              type="email"
              name="sellerEmail"
              placeholder="contact@example.com"
              value={form.sellerEmail}
              onChange={(e) =>
                setForm({ ...form, sellerEmail: e.target.value })
              }
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Seller rating (0–5)</label>
            <input
              type="number"
              name="sellerRating"
              min="0"
              max="5"
              step="0.1"
              placeholder="5"
              value={form.sellerRating}
              onChange={(e) =>
                setForm({ ...form, sellerRating: Number(e.target.value) })
              }
              required
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Seller reviews</label>
          <div className="space-y-2">
            {form.sellerReviews.map((r, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={r}
                  onChange={(e) => updateSellerReview(i, e.target.value)}
                  placeholder="Review text"
                  className={`${inputClass} flex-1`}
                />
                <button
                  type="button"
                  onClick={() => removeSellerReview(i)}
                  className="p-2.5 rounded-lg border border-neutral-border text-gray-400 hover:text-red-400 hover:border-red-400/50 transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSellerReview}
              className="flex items-center gap-1.5 text-sm text-primary hover:text-white transition-colors mt-2"
            >
              <Plus className="size-4" />
              Add seller review
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4 pt-4 border-t border-neutral-border">
        <h4 className="flex items-center gap-2 text-white font-semibold">
          <Star className="size-5 text-primary" />
          Product reviews
        </h4>
        <div className="space-y-2">
          {form.reviews.map((r, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={r}
                onChange={(e) => updateReview(i, e.target.value)}
                placeholder="Review text"
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={() => removeReview(i)}
                className="p-2.5 rounded-lg border border-neutral-border text-gray-400 hover:text-red-400 hover:border-red-400/50 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addReview}
            className="flex items-center gap-1.5 text-sm text-primary hover:text-white transition-colors mt-2"
          >
            <Plus className="size-4" />
            Add product review
          </button>
        </div>
      </section>

      {error && (
        <p className="text-sm text-red-400 py-2 px-4 rounded-lg bg-red-500/10 border border-red-500/30">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark disabled:opacity-50 transition-colors"
      >
        {isPending ? "Creating..." : "Create product"}
      </button>
    </form>
  );
}
