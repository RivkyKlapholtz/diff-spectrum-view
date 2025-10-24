import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export function useDiffStats() {
  return useQuery({
    queryKey: ["diff-stats"],
    queryFn: api.getDiffStats,
    refetchInterval: 5000, // Refetch every 5 seconds for live updates
  });
}

export function useDiffsByCategory(category: string | null) {
  return useQuery({
    queryKey: ["diffs", category],
    queryFn: () => (category ? api.getDiffsByCategory(category) : Promise.resolve([])),
    enabled: !!category,
    refetchInterval: 5000, // Refetch every 5 seconds for live updates
  });
}

export function useDiffById(id: string | null) {
  return useQuery({
    queryKey: ["diff", id],
    queryFn: () => (id ? api.getDiffById(id) : Promise.reject("No ID provided")),
    enabled: !!id,
  });
}
