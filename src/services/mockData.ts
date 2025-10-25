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
    diffType: "body",
    metadata: {
      endpoint: "/api/v1/users/profile",
      method: "GET",
      duration: 245,
    },
    prodCurlRequest: `curl -X GET 'https://api.production.com/api/v1/users/profile' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.prod_token' \\
  -H 'Accept: application/json'`,
    integCurlRequest: `curl -X GET 'https://api.integration.com/api/v1/users/profile' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.integ_token' \\
  -H 'Accept: application/json'`,
    prodNormalizedResponse: JSON.stringify(
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
    integNormalizedResponse: JSON.stringify(
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
    prodIgnoredFields: ["lastLoginTimestamp", "sessionId"],
    integIgnoredFields: ["lastLoginTimestamp", "sessionId"],
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
    diffType: "body",
    metadata: {
      endpoint: "/api/v1/products",
      method: "GET",
      duration: 512,
    },
    prodCurlRequest: `curl -X GET 'https://api.production.com/api/v1/products?page=1&limit=10' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer prod_token_xyz' \\
  -H 'Accept: application/json' \\
  -H 'User-Agent: DiffMonitor/1.0'`,
    integCurlRequest: `curl -X GET 'https://api.integration.com/api/v1/products?page=1&limit=10' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer integ_token_xyz' \\
  -H 'Accept: application/json' \\
  -H 'User-Agent: DiffMonitor/1.0'`,
    prodNormalizedResponse: JSON.stringify(
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
    integNormalizedResponse: JSON.stringify(
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
    prodIgnoredFields: ["responseTime", "serverId"],
    integIgnoredFields: ["responseTime", "serverId"],
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
    diffType: "body",
    metadata: {
      endpoint: "/api/v1/orders/ORD-789",
      method: "GET",
      duration: 1023,
    },
    prodCurlRequest: `curl -X GET 'https://api.production.com/api/v1/orders/ORD-789' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer prod_order_token' \\
  -H 'X-Request-ID: req-789-prod' \\
  -H 'Accept: application/json'`,
    integCurlRequest: `curl -X GET 'https://api.integration.com/api/v1/orders/ORD-789' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer integ_order_token' \\
  -H 'X-Request-ID: req-789-integ' \\
  -H 'Accept: application/json'`,
    prodNormalizedResponse: JSON.stringify(
      {
        orderId: "ORD-789",
        status: "processing",
        items: 3,
        total: 149.97,
      },
      null,
      2
    ),
    integNormalizedResponse: JSON.stringify(
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
    prodIgnoredFields: ["internalNotes"],
    integIgnoredFields: ["internalNotes"],
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
    diffType: "body",
    metadata: {
      endpoint: "/api/v1/payments/webhook",
      method: "POST",
      duration: 89,
    },
    prodCurlRequest: `curl -X POST 'https://api.production.com/api/v1/payments/webhook' \\
  -H 'Content-Type: application/json' \\
  -H 'X-Webhook-Signature: sha256=prod_signature_abc123' \\
  -d '{
    "event": "payment.completed",
    "paymentId": "PAY-456",
    "amount": 99.99,
    "timestamp": "2025-01-23T07:20:15Z"
  }'`,
    integCurlRequest: `curl -X POST 'https://api.integration.com/api/v1/payments/webhook' \\
  -H 'Content-Type: application/json' \\
  -H 'X-Webhook-Signature: sha256=integ_signature_def456' \\
  -d '{
    "event": "payment.completed",
    "paymentId": "PAY-456",
    "amount": 99.99,
    "timestamp": "2025-01-23T07:20:15Z"
  }'`,
    prodNormalizedResponse: JSON.stringify(
      {
        paymentId: "PAY-456",
        status: "pending",
        amount: 99.99,
        currency: "USD",
      },
      null,
      2
    ),
    integNormalizedResponse: JSON.stringify(
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
    prodIgnoredFields: ["webhookId", "receivedAt"],
    integIgnoredFields: ["webhookId", "receivedAt"],
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
    diffType: "body",
    metadata: {
      endpoint: "/api/v1/analytics/export",
      method: "POST",
      duration: 3456,
    },
    prodCurlRequest: `curl -X POST 'https://api.production.com/api/v1/analytics/export' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer prod_analytics_token' \\
  -d '{
    "reportId": "RPT-123",
    "format": "json",
    "dateRange": {
      "start": "2025-01-01",
      "end": "2025-01-23"
    }
  }'`,
    integCurlRequest: `curl -X POST 'https://api.integration.com/api/v1/analytics/export' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer integ_analytics_token' \\
  -d '{
    "reportId": "RPT-123",
    "format": "json",
    "dateRange": {
      "start": "2025-01-01",
      "end": "2025-01-23"
    }
  }'`,
    prodNormalizedResponse: JSON.stringify(
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
    integNormalizedResponse: JSON.stringify(
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
    prodIgnoredFields: ["generatedAt", "exportId"],
    integIgnoredFields: ["generatedAt", "exportId"],
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
    diffType: "status_code",
    metadata: {
      endpoint: "/health",
      method: "GET",
      duration: 45,
    },
    prodCurlRequest: `curl -X GET 'https://api.production.com/health' \\
  -H 'Accept: application/json'`,
    integCurlRequest: `curl -X GET 'https://api.integration.com/health' \\
  -H 'Accept: application/json'`,
    prodNormalizedResponse: "200",
    integNormalizedResponse: "503",
    oldValue: "200",
    newValue: "503",
  },
  {
    id: "status-2",
    category: "status_code",
    jobId: "job-2024-007",
    jobName: "API Gateway Status",
    timestamp: "2025-01-23T10:45:00Z",
    diffType: "status_code",
    metadata: {
      endpoint: "/api/v1/gateway",
      method: "GET",
      duration: 5012,
    },
    prodCurlRequest: `curl -X GET 'https://api.production.com/api/v1/gateway' \\
  -H 'Content-Type: application/json' \\
  -H 'X-API-Key: sk_live_prod_51234567890' \\
  -H 'Accept: application/json'`,
    integCurlRequest: `curl -X GET 'https://api.integration.com/api/v1/gateway' \\
  -H 'Content-Type: application/json' \\
  -H 'X-API-Key: sk_test_integ_51234567890' \\
  -H 'Accept: application/json'`,
    prodNormalizedResponse: "200",
    integNormalizedResponse: "504",
    oldValue: "200",
    newValue: "504",
  },
  {
    id: "status-3",
    category: "status_code",
    jobId: "job-2024-008",
    jobName: "Authentication Endpoint",
    timestamp: "2025-01-23T10:30:00Z",
    diffType: "status_code",
    metadata: {
      endpoint: "/api/v1/auth/login",
      method: "POST",
      duration: 156,
    },
    prodCurlRequest: `curl -X POST 'https://api.production.com/api/v1/auth/login' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "email": "user@example.com",
    "password": "********",
    "rememberMe": true
  }'`,
    integCurlRequest: `curl -X POST 'https://api.integration.com/api/v1/auth/login' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "email": "user@example.com",
    "password": "********",
    "rememberMe": true
  }'`,
    prodNormalizedResponse: "401",
    integNormalizedResponse: "200",
    oldValue: "401",
    newValue: "200",
  },
];

export const mockData: Record<string, DiffItem[]> = {
  json_response: mockJsonResponseDiffs,
  status_code: mockStatusCodeDiffs,
};
