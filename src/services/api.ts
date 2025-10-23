import { DiffItem, DiffStats } from "@/types/diff";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const api = {
  async getDiffStats(): Promise<DiffStats> {
    const response = await fetch(`${API_BASE_URL}/diffs/stats`);
    if (!response.ok) {
      throw new Error("Failed to fetch diff stats");
    }
    return response.json();
  },

  async getDiffsByCategory(category: string): Promise<DiffItem[]> {
    const response = await fetch(`${API_BASE_URL}/diffs?category=${category}`);
    if (!response.ok) {
      throw new Error("Failed to fetch diffs");
    }
    return response.json();
  },

  async getDiffById(id: string): Promise<DiffItem> {
    const response = await fetch(`${API_BASE_URL}/diffs/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch diff");
    }
    return response.json();
  },
};
