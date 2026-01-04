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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h2 className="text-2xl font-bold text-white">Hydration profile</h2>
      {mutation.isError && (
        <p className="text-sm text-red-400">{mutation.error?.message}</p>
      )}
      {mutation.isSuccess && (
        <p className="text-sm text-green-400">Saved!</p>
      )}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Activity level</label>
        <select
          value={form.activityLevel}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              activityLevel: e.target.value as Profile["activityLevel"],
            }))
          }
          className="w-full px-4 py-2 rounded-lg border border-neutral-border bg-background-dark text-white"
        >
          <option value="sedentary">Sedentary</option>
          <option value="moderate">Moderate</option>
          <option value="active">Active</option>
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Climate</label>
        <select
          value={form.climate}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              climate: e.target.value as Profile["climate"],
            }))
          }
          className="w-full px-4 py-2 rounded-lg border border-neutral-border bg-background-dark text-white"
        >
          <option value="dry">Dry</option>
          <option value="humid">Humid</option>
          <option value="temperate">Temperate</option>
        </select>
      </div>
      <input
        type="text"
        placeholder="Dietary preference (optional)"
        value={form.dietaryPreference ?? ""}
        onChange={(e) =>
          setForm((f) => ({ ...f, dietaryPreference: e.target.value }))
        }
        className="w-full px-4 py-2 rounded-lg border border-neutral-border bg-background-dark text-white"
      />
      <input
        type="text"
        placeholder="Hydration goal (optional)"
        value={form.hydrationGoal ?? ""}
        onChange={(e) =>
          setForm((f) => ({ ...f, hydrationGoal: e.target.value }))
        }
        className="w-full px-4 py-2 rounded-lg border border-neutral-border bg-background-dark text-white"
      />
      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full py-2 rounded-lg bg-primary text-white font-bold disabled:opacity-50"
      >
        {mutation.isPending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
