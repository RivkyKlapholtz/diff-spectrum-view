using Hangfire.Dashboard;

namespace DiffMonitor.Api;

public class HangfireAuthorizationFilter : IDashboardAuthorizationFilter
{
    public bool Authorize(DashboardContext context)
    {
        // In production, implement proper authentication
        // For development, allow all
        return true;
    }
}
