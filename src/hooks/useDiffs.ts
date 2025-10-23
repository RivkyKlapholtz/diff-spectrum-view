import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export function useDiffStats() {
  return useQuery({
    queryKey: ["diff-stats"],
    queryFn: api.getDiffStats,
  });
}

export function useDiffsByCategory(category: string | null) {
  return useQuery({
    queryKey: ["diffs", category],
    queryFn: () => (category ? api.getDiffsByCategory(category) : Promise.resolve([])),
    enabled: !!category,
  });
}

export function useDiffById(id: string | null) {
  return useQuery({
    queryKey: ["diff", id],
    queryFn: () => (id ? api.getDiffById(id) : Promise.reject("No ID provided")),
    enabled: !!id,
  });
}
