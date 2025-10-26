import { DiffItem, DiffStats } from "@/types/diff";
import { mockDiffStats, mockData } from "./mockData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const USE_MOCK_DATA = true; // Set to false and configure VITE_API_BASE_URL to connect to your Hangfire backend

export const api = {
  async getDiffStats(): Promise<DiffStats> {
    if (USE_MOCK_DATA) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockDiffStats;
    }

    const response = await fetch(`${API_BASE_URL}/diffs/stats`);
    if (!response.ok) {
      throw new Error("Failed to fetch diff stats");
    }
    return response.json();
  },

  async getDiffsByCategory(category: string): Promise<DiffItem[]> {
    if (USE_MOCK_DATA) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 400));
      // For deleted_diffs, return all diffs from all categories
      if (category === "deleted_diffs") {
        return Object.values(mockData).flat();
      }
      return mockData[category] || [];
    }

    const response = await fetch(`${API_BASE_URL}/diffs?category=${category}`);
    if (!response.ok) {
      throw new Error("Failed to fetch diffs");
    }
    return response.json();
  },

  async getDiffById(id: string): Promise<DiffItem> {
    if (USE_MOCK_DATA) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 200));
      const allDiffs = Object.values(mockData).flat();
      const diff = allDiffs.find((d) => d.id === id);
      if (!diff) {
        throw new Error("Diff not found");
      }
      return diff;
    }

    const response = await fetch(`${API_BASE_URL}/diffs/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch diff");
    }
    return response.json();
  },
};
