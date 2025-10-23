import { DiffItem, DiffStats } from "@/types/diff";

export const mockDiffStats: DiffStats = {
  totalDiffs: 8,
  categories: [
    {
      id: "json_response",
      label: "JSON Response",
      icon: "FileJson",
      count: 5,
    },
    {
      id: "status_code",
      label: "Status Code",
      icon: "Hash",
      count: 3,
    },
  ],
};

export const mockJsonResponseDiffs: DiffItem[] = [
  {
    id: "json-1",
    category: "json_response",
    jobId: "job-2024-001",
    jobName: "User Profile API Sync",
    timestamp: "2025-01-23T10:30:00Z",
    status: "completed",
    metadata: {
      endpoint: "/api/v1/users/profile",
      method: "GET",
      duration: 245,
    },
    oldValue: JSON.stringify(
      {
        userId: "12345",
        name: "John Doe",
        email: "john@example.com",
        role: "user",
        subscription: "free",
      },
      null,
      2
    ),
    newValue: JSON.stringify(
      {
        userId: "12345",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "admin",
        subscription: "premium",
        joinedDate: "2024-01-15",
      },
      null,
      2
    ),
  },
  {
    id: "json-2",
    category: "json_response",
    jobId: "job-2024-002",
    jobName: "Product Catalog Sync",
    timestamp: "2025-01-23T09:15:00Z",
    status: "completed",
    metadata: {
      endpoint: "/api/v1/products",
      method: "GET",
      duration: 512,
    },
    oldValue: JSON.stringify(
      {
        products: [
          { id: 1, name: "Widget A", price: 29.99, stock: 100 },
          { id: 2, name: "Widget B", price: 39.99, stock: 50 },
        ],
        totalCount: 2,
      },
      null,
      2
    ),
    newValue: JSON.stringify(
      {
        products: [
          { id: 1, name: "Widget A", price: 24.99, stock: 100, onSale: true },
          { id: 2, name: "Widget B Pro", price: 49.99, stock: 75 },
          { id: 3, name: "Widget C", price: 19.99, stock: 200 },
        ],
        totalCount: 3,
        lastUpdated: "2025-01-23T09:15:00Z",
      },
      null,
      2
    ),
  },
  {
    id: "json-3",
    category: "json_response",
    jobId: "job-2024-003",
    jobName: "Order Status Check",
    timestamp: "2025-01-23T08:45:00Z",
    status: "failed",
    metadata: {
      endpoint: "/api/v1/orders/ORD-789",
      method: "GET",
      duration: 1023,
    },
    oldValue: JSON.stringify(
      {
        orderId: "ORD-789",
        status: "processing",
        items: 3,
        total: 149.97,
      },
      null,
      2
    ),
    newValue: JSON.stringify(
      {
        orderId: "ORD-789",
        status: "shipped",
        items: 3,
        total: 149.97,
        trackingNumber: "TRK-123456789",
        estimatedDelivery: "2025-01-25",
      },
      null,
      2
    ),
  },
  {
    id: "json-4",
    category: "json_response",
    jobId: "job-2024-004",
    jobName: "Payment Gateway Webhook",
    timestamp: "2025-01-23T07:20:00Z",
    status: "completed",
    metadata: {
      endpoint: "/api/v1/payments/webhook",
      method: "POST",
      duration: 89,
    },
    oldValue: JSON.stringify(
      {
        paymentId: "PAY-456",
        status: "pending",
        amount: 99.99,
        currency: "USD",
      },
      null,
      2
    ),
    newValue: JSON.stringify(
      {
        paymentId: "PAY-456",
        status: "completed",
        amount: 99.99,
        currency: "USD",
        processorResponse: "approved",
        transactionId: "TXN-987654321",
        completedAt: "2025-01-23T07:20:15Z",
      },
      null,
      2
    ),
  },
  {
    id: "json-5",
    category: "json_response",
    jobId: "job-2024-005",
    jobName: "Analytics Data Export",
    timestamp: "2025-01-23T06:00:00Z",
    status: "pending",
    metadata: {
      endpoint: "/api/v1/analytics/export",
      method: "POST",
      duration: 3456,
    },
    oldValue: JSON.stringify(
      {
        reportId: "RPT-123",
        metrics: {
          pageViews: 1500,
          uniqueVisitors: 450,
        },
      },
      null,
      2
    ),
    newValue: JSON.stringify(
      {
        reportId: "RPT-123",
        metrics: {
          pageViews: 2100,
          uniqueVisitors: 620,
          bounceRate: 45.2,
          avgSessionDuration: 245,
        },
        dateRange: {
          start: "2025-01-01",
          end: "2025-01-23",
        },
      },
      null,
      2
    ),
  },
];

export const mockStatusCodeDiffs: DiffItem[] = [
  {
    id: "status-1",
    category: "status_code",
    jobId: "job-2024-006",
    jobName: "Health Check Monitor",
    timestamp: "2025-01-23T11:00:00Z",
    status: "completed",
    metadata: {
      endpoint: "/health",
      method: "GET",
      duration: 45,
    },
    oldValue: "200",
    newValue: "503",
  },
  {
    id: "status-2",
    category: "status_code",
    jobId: "job-2024-007",
    jobName: "API Gateway Status",
    timestamp: "2025-01-23T10:45:00Z",
    status: "failed",
    metadata: {
      endpoint: "/api/v1/gateway",
      method: "GET",
      duration: 5012,
    },
    oldValue: "200",
    newValue: "504",
  },
  {
    id: "status-3",
    category: "status_code",
    jobId: "job-2024-008",
    jobName: "Authentication Endpoint",
    timestamp: "2025-01-23T10:30:00Z",
    status: "completed",
    metadata: {
      endpoint: "/api/v1/auth/login",
      method: "POST",
      duration: 156,
    },
    oldValue: "401",
    newValue: "200",
  },
];

export const mockData: Record<string, DiffItem[]> = {
  json_response: mockJsonResponseDiffs,
  status_code: mockStatusCodeDiffs,
};
