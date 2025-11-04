# DiffMonitor - C# Backend with Hangfire

Backend API for monitoring and comparing API responses between Production and Integration environments.

## Prerequisites

- .NET 8.0 SDK - [הורד כאן](https://dotnet.microsoft.com/download/dotnet/8.0)
- SQL Server (LocalDB מגיע עם Visual Studio, או גרסה מלאה)
- Visual Studio 2022 (מומלץ) או VS Code

## הוראות הרצה מהירות

### אפשרות 1: Visual Studio 2022 (מומלץ)

1. **פתח את הפרויקט:**
   - פתח את `backend-csharp/DiffMonitor.sln` ב-Visual Studio
   - או: לחץ פעמיים על הקובץ `DiffMonitor.sln`

2. **שחזר חבילות NuGet:**
   - Visual Studio אמור לעשות זאת אוטומטית
   - אם לא: לחץ ימני על הפתרון (Solution) → "Restore NuGet Packages"

3. **עדכן Connection Strings:**
   - פתח `appsettings.json`
   - אם יש לך SQL Server מקומי, השאר כמו שזה
   - אם אתה משתמש ב-LocalDB (ברירת המחדל של Visual Studio):
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=DiffMonitor;Trusted_Connection=True;MultipleActiveResultSets=true",
     "HangfireConnection": "Server=(localdb)\\mssqllocaldb;Database=DiffMonitorHangfire;Trusted_Connection=True;MultipleActiveResultSets=true"
   }
   ```

4. **צור את בסיס הנתונים:**
   - פתח **Package Manager Console** (Tools → NuGet Package Manager → Package Manager Console)
   - הרץ:
   ```
   Add-Migration InitialCreate
   Update-Database
   ```

5. **הרץ את הפרויקט:**
   - לחץ F5 או על כפתור ▶ (Start)
   - הדפדפן ייפתח אוטומטית עם Swagger

### אפשרות 2: שורת פקודה (Command Line)

```bash
# 1. נווט לתיקיית הפרויקט
cd backend-csharp/DiffMonitor.Api

# 2. שחזר חבילות
dotnet restore

# 3. צור מיגרציה ועדכן בסיס נתונים
dotnet ef migrations add InitialCreate
dotnet ef database update

# 4. הרץ את האפליקציה
dotnet run
```

## כתובות חשובות

לאחר הרצת הפרויקט, תהיה לך גישה ל:
- **API:** `http://localhost:5000`
- **Swagger UI:** `http://localhost:5000/swagger` - תיעוד API אינטראקטיבי
- **Hangfire Dashboard:** `http://localhost:5000/hangfire` - ניטור עבודות רקע

## הגדרת Endpoints לניטור

עבור אל `appsettings.json` והגדר את כתובות ה-API שברצונך לנטר:

```json
"ApiConfiguration": {
  "ProductionBaseUrl": "https://your-production-api.com",
  "IntegrationBaseUrl": "https://your-integration-api.com",
  "Endpoints": [
    {
      "Path": "/api/v1/users/profile",
      "Method": "GET"
    }
  ]
}
```

**שים לב:** עבור Flapi, אין צורך להגדיר Endpoints כאן - הבקשות יגיעו אוטומטית דרך POST endpoint `/api/duplication`.

## API Endpoints

### GET /api/jobsStatus
מחזיר סטטיסטיקות של עבודות:
```json
{
  "failedDiffs": 47,
  "successedDiffs": 153,
  "failedJobs": 5,
  "jobCounter": 200
}
```

### GET /api/diffsByType?type={type}
מחזיר מערך של מזהי diff לפי סוג:
- `json_response` - הבדלים בתוכן JSON
- `status_code` - הבדלים בקוד סטטוס
- `deleted_diffs` - diffs שנמחקו

### GET /api/diffDetailes?id={id}
מחזיר מידע מפורט על diff ספציפי.

### POST /api/duplication
**נקודת קצה זו משמשת את Flapi** - מקבלת בקשה משוכפלת ומשווה בין התגובות:
```json
{
  "testUrl": "https://integration-api.com/api/endpoint",
  "sourceUrl": "https://production-api.com/api/endpoint",
  "content": "{...}",
  "expectedResponse": "{...}",
  "options": {
    "allowSemanticCompresion": true
  }
}
```

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

## חיבור הקליינט (Frontend) לבאקאנד

לאחר שהבאקאנד רץ, עבור לקובץ `src/services/api.ts` בפרויקט הקליינט ושנה:

```typescript
const API_BASE_URL = 'http://localhost:5000/api';
const USE_MOCK_DATA = false; // שנה ל-false כדי להשתמש בבאקאנד האמיתי
```

## פתרון בעיות נפוצות

### בעיות חיבור לבסיס נתונים
- ודא ש-SQL Server רץ
- בדוק את ה-connection strings ב-`appsettings.json`
- עבור LocalDB: הרץ `sqllocaldb start mssqllocaldb` בשורת הפקודה
- אם יש שגיאת הרשאות, הרץ Visual Studio כמנהל (Run as Administrator)

### שגיאה: "Cannot connect to SQL Server"
```bash
# בדוק אם LocalDB מותקן
sqllocaldb info

# צור instance חדש אם צריך
sqllocaldb create MSSQLLocalDB

# התחל את ה-instance
sqllocaldb start MSSQLLocalDB
```

### שגיאה: "dotnet ef command not found"
```bash
# התקן את EF Core tools
dotnet tool install --global dotnet-ef
```

### Hangfire Dashboard לא נטען
- ודא שאתה ניגש ל-`/hangfire` (ולא `/hangfire/`)
- נקה את cache הדפדפן

### CORS Errors מהקליינט
- ודא שהבאקאנד רץ על `http://localhost:5000`
- בדוק שה-CORS מוגדר נכון ב-`Program.cs` (כבר מוגדר לאפשר הכל ב-development)

## Production Considerations

1. **Authentication**: Implement proper authentication for the Hangfire dashboard
2. **CORS**: Restrict CORS to specific origins
3. **Connection Strings**: Use secure connection strings with proper credentials
4. **Logging**: Configure production logging (Serilog, Application Insights, etc.)
5. **Error Handling**: Add global exception handling middleware
6. **Rate Limiting**: Add rate limiting for API endpoints
