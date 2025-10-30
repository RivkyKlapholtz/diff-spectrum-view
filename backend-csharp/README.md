# DiffMonitor - C# Backend with Hangfire

Backend API for monitoring and comparing API responses between Production and Integration environments.

## Prerequisites

- .NET 8.0 SDK
- SQL Server (LocalDB or full version)
- Visual Studio 2022 or VS Code

## Setup Instructions

### 1. Install .NET 8.0 SDK
Download from: https://dotnet.microsoft.com/download/dotnet/8.0

### 2. Configure Database Connection Strings

Edit `appsettings.json` and update the connection strings:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=DiffMonitor;Trusted_Connection=True;TrustServerCertificate=True;",
  "HangfireConnection": "Server=localhost;Database=DiffMonitorHangfire;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

For LocalDB, use:
```
Server=(localdb)\\mssqllocaldb;Database=DiffMonitor;Trusted_Connection=True;
```

### 3. Configure API Endpoints

Edit `appsettings.json` to configure the endpoints you want to monitor:

```json
"ApiConfiguration": {
  "ProductionBaseUrl": "https://api.production.com",
  "IntegrationBaseUrl": "https://api.integration.com",
  "Endpoints": [
    {
      "Path": "/api/v1/users/profile",
      "Method": "GET"
    },
    {
      "Path": "/api/v1/products",
      "Method": "GET"
    }
  ]
}
```

### 4. Create Database

Open Package Manager Console in Visual Studio or terminal:

```bash
cd DiffMonitor.Api
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 5. Run the Application

```bash
cd DiffMonitor.Api
dotnet run
```

The API will be available at:
- API: `http://localhost:5000`
- Swagger: `http://localhost:5000/swagger`
- Hangfire Dashboard: `http://localhost:5000/hangfire`

## API Endpoints

### GET /api/jobsStatus
Returns job statistics:
```json
{
  "failedDiffs": 47,
  "successedDiffs": 153,
  "failedJobs": 5,
  "jobCounter": 200
}
```

### GET /api/diffsByType?type={type}
Returns array of diff IDs for a specific type:
- `json_response`
- `status_code`
- `deleted_diffs`

### GET /api/diffDetailes?id={id}
Returns detailed information about a specific diff.

## Hangfire Configuration

The application uses Hangfire for background job processing. Jobs are scheduled to run every minute by default.

To change the schedule, edit `Program.cs`:

```csharp
RecurringJob.AddOrUpdate<DiffComparisonJob>(
    "run-diff-comparisons",
    job => job.ExecuteAsync(),
    Cron.Minutely()); // Change to Cron.Hourly(), Cron.Daily(), etc.
```

## Project Structure

```
DiffMonitor.Api/
├── Controllers/
│   └── DiffsController.cs       # API endpoints
├── Data/
│   ├── AppDbContext.cs          # EF Core context
│   └── Entities/                # Database entities
├── Jobs/
│   └── DiffComparisonJob.cs     # Hangfire background job
├── Models/
│   ├── DiffItem.cs              # API models
│   └── JobsStatus.cs
├── Services/
│   ├── DiffService.cs           # Data access service
│   └── ComparisonService.cs     # API comparison logic
└── Program.cs                   # Application startup
```

## Troubleshooting

### Database Connection Issues
- Make sure SQL Server is running
- Verify connection strings in `appsettings.json`
- For LocalDB: `sqllocaldb start mssqllocaldb`

### CORS Issues
The API allows all origins by default. For production, update the CORS policy in `Program.cs`.

### Hangfire Dashboard Not Loading
Make sure you're accessing `/hangfire` (not `/hangfire/`)

## Production Considerations

1. **Authentication**: Implement proper authentication for the Hangfire dashboard
2. **CORS**: Restrict CORS to specific origins
3. **Connection Strings**: Use secure connection strings with proper credentials
4. **Logging**: Configure production logging (Serilog, Application Insights, etc.)
5. **Error Handling**: Add global exception handling middleware
6. **Rate Limiting**: Add rate limiting for API endpoints
