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
  status: "completed" | "failed";
  diffType: "status_code" | "body";
  prodNormalizedResponse: string;
  integNormalizedResponse: string;
  prodIgnoredFields?: string[];
  integIgnoredFields?: string[];
  prodCurlRequest: string;
  integCurlRequest: string;
  metadata?: {
    endpoint?: string;
    method?: string;
    duration?: number;
  };
  // Legacy fields for backward compatibility
  oldValue: string;
  newValue: string;
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
