export type DiffCategoryType = 
  | "json_response" 
  | "status_code" 
  | "headers" 
  | "query_params" 
  | "request_body"
  | "timing";

export interface DiffItem {
  id: string;
  category: DiffCategoryType;
  jobId: string;
  jobName: string;
  timestamp: string;
  status: "pending" | "completed" | "failed";
  oldValue: string;
  newValue: string;
  metadata?: {
    endpoint?: string;
    method?: string;
    duration?: number;
  };
}

export interface DiffCategory {
  id: DiffCategoryType;
  label: string;
  icon: string;
  count: number;
}

export interface DiffStats {
  totalDiffs: number;
  categories: DiffCategory[];
}
