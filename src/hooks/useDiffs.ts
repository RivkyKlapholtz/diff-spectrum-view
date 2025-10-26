import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export function useJobsStatus() {
  return useQuery({
    queryKey: ["jobs-status"],
    queryFn: api.getJobsStatus,
    refetchInterval: 5000,
  });
}

export function useDiffStats() {
  return useQuery({
    queryKey: ["diff-stats"],
    queryFn: api.getDiffStats,
    refetchInterval: 5000,
  });
}

export function useDiffsByType(diffType: string | null) {
  return useQuery({
    queryKey: ["diffs-by-type", diffType],
    queryFn: async () => {
      if (!diffType) return [];
      const ids = await api.getDiffsByType(diffType);
      return Promise.all(ids.map(id => api.getDiffDetails(id)));
    },
    enabled: !!diffType,
    refetchInterval: 5000,
  });
}

export function useDiffById(id: string | null) {
  return useQuery({
    queryKey: ["diff", id],
    queryFn: () => (id ? api.getDiffDetails(id) : Promise.reject("No ID provided")),
    enabled: !!id,
  });
}
