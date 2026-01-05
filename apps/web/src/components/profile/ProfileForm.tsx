import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

type Profile = {
  activityLevel: "sedentary" | "moderate" | "active";
  climate: "dry" | "humid" | "temperate";
  dietaryPreference?: string | null;
  hydrationGoal?: string | null;
};

export function ProfileForm() {
  const [form, setForm] = useState<Profile>({
    activityLevel: "moderate",
    climate: "temperate",
    dietaryPreference: "",
    hydrationGoal: "",
  });

  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await api.get<{ data: Profile | null }>("/users/profile");
      return res.data.data;
    },
  });

  useEffect(() => {
    if (data) {
      setForm({
        activityLevel: data.activityLevel,
        climate: data.climate,
        dietaryPreference: data.dietaryPreference ?? "",
        hydrationGoal: data.hydrationGoal ?? "",
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (body: Profile) => api.put("/users/profile", body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      ...form,
      dietaryPreference: form.dietaryPreference || undefined,
      hydrationGoal: form.hydrationGoal || undefined,
    });
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-neutral-border bg-background-dark text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-colors";
  const labelClass = "block text-sm font-medium text-gray-400 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {mutation.isError && (
        <p className="text-sm text-red-400">{mutation.error?.message}</p>
      )}
      {mutation.isSuccess && (
        <p className="text-sm text-green-400">Saved!</p>
      )}
      <div className="rounded-lg border border-white/10 bg-white/5 p-6 space-y-4">
        <h4 className="font-semibold text-white">Lifestyle</h4>
        <div>
          <label className={labelClass}>Activity level</label>
          <select
            value={form.activityLevel}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                activityLevel: e.target.value as Profile["activityLevel"],
              }))
            }
            className={inputClass}
          >
            <option value="sedentary">Sedentary — desk job, little exercise</option>
            <option value="moderate">Moderate — regular walks, light activity</option>
            <option value="active">Active — frequent workouts, high activity</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Climate</label>
          <select
            value={form.climate}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                climate: e.target.value as Profile["climate"],
              }))
            }
            className={inputClass}
          >
            <option value="dry">Dry — low humidity, desert or arid</option>
            <option value="humid">Humid — high humidity, tropical</option>
            <option value="temperate">Temperate — moderate, varied seasons</option>
          </select>
        </div>
      </div>
      <div className="rounded-lg border border-white/10 bg-white/5 p-6 space-y-4">
        <h4 className="font-semibold text-white">Preferences (optional)</h4>
        <div>
          <label className={labelClass}>Dietary preference</label>
          <input
            type="text"
            placeholder="e.g. Low sodium, vegan, high protein"
            value={form.dietaryPreference ?? ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, dietaryPreference: e.target.value }))
            }
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Hydration goal</label>
          <input
            type="text"
            placeholder="e.g. 2L daily, stay ahead of thirst, optimize for workouts"
            value={form.hydrationGoal ?? ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, hydrationGoal: e.target.value }))
            }
            className={inputClass}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full py-3 rounded-lg bg-primary text-white font-bold disabled:opacity-50 hover:bg-primary-dark transition-colors"
      >
        {mutation.isPending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
