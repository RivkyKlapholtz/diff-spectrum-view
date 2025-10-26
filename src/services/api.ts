import { DiffItem, DiffStats, JobsStatus } from "@/types/diff";
import { mockDiffStats, mockData, mockJobsStatus } from "./mockData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const USE_MOCK_DATA = true; // Set to false and configure VITE_API_BASE_URL to connect to your Hangfire backend

export const api = {
  async getJobsStatus(): Promise<JobsStatus> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockJobsStatus;
    }

    const response = await fetch(`${API_BASE_URL}/jobsStatus`);
    if (!response.ok) {
      throw new Error("Failed to fetch jobs status");
    }
    return response.json();
  },

  async getDiffStats(): Promise<DiffStats> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockDiffStats;
    }

    const response = await fetch(`${API_BASE_URL}/diffs/stats`);
    if (!response.ok) {
      throw new Error("Failed to fetch diff stats");
    }
    return response.json();
  },

  async getDiffsByType(diffType: string): Promise<string[]> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      if (diffType === "deleted_diffs") {
        return Object.values(mockData).flat().map(d => d.id);
      }
      return (mockData[diffType] || []).map(d => d.id);
    }

    const response = await fetch(`${API_BASE_URL}/diffsByType?type=${diffType}`);
    if (!response.ok) {
      throw new Error("Failed to fetch diffs by type");
    }
    return response.json();
  },

  async getDiffDetails(id: string): Promise<DiffItem> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const allDiffs = Object.values(mockData).flat();
      const diff = allDiffs.find((d) => d.id === id);
      if (!diff) {
        throw new Error("Diff not found");
      }
      return diff;
    }

    const response = await fetch(`${API_BASE_URL}/diffDetailes?id=${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch diff details");
    }
    return response.json();
  },
};
