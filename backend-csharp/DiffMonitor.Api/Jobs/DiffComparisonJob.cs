using DiffMonitor.Api.Data;
using DiffMonitor.Api.Data.Entities;
using DiffMonitor.Api.Services;

namespace DiffMonitor.Api;

public class DiffComparisonJob
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<DiffComparisonJob> _logger;
    private readonly IConfiguration _configuration;

    public DiffComparisonJob(
        IServiceProvider serviceProvider,
        ILogger<DiffComparisonJob> logger,
        IConfiguration configuration)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
        _configuration = configuration;
    }

    public async Task ExecuteAsync()
    {
        _logger.LogInformation("Starting diff comparison job at {Time}", DateTime.UtcNow);

        using var scope = _serviceProvider.CreateScope();
        var comparisonService = scope.ServiceProvider.GetRequiredService<IComparisonService>();
        var diffService = scope.ServiceProvider.GetRequiredService<IDiffService>();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var endpoints = _configuration.GetSection("ApiConfiguration:Endpoints").Get<List<EndpointConfig>>();

        if (endpoints == null || !endpoints.Any())
        {
            _logger.LogWarning("No endpoints configured");
            return;
        }

        foreach (var endpoint in endpoints)
        {
            var jobId = Guid.NewGuid().ToString();

            try
            {
                _logger.LogInformation("Comparing endpoint: {Method} {Path}", endpoint.Method, endpoint.Path);

                var result = await comparisonService.CompareEndpointsAsync(endpoint.Path, endpoint.Method);

                if (!string.IsNullOrEmpty(result.ErrorMessage))
                {
                    // Job failed
                    await SaveJobStatus(dbContext, jobId, JobResult.Failed, result.ErrorMessage);
                }
                else if (result.HasDifference && result.Diff != null)
                {
                    // Job succeeded but found differences
                    result.Diff.JobId = jobId;
                    await diffService.SaveDiffAsync(result.Diff);
                    await SaveJobStatus(dbContext, jobId, JobResult.SuccessWithDiff);
                }
                else
                {
                    // Job succeeded with no differences
                    await SaveJobStatus(dbContext, jobId, JobResult.SuccessNoDiff);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error comparing endpoint: {Method} {Path}", endpoint.Method, endpoint.Path);
                await SaveJobStatus(dbContext, jobId, JobResult.Failed, ex.Message);
            }
        }

        _logger.LogInformation("Completed diff comparison job at {Time}", DateTime.UtcNow);
    }

    private async Task SaveJobStatus(AppDbContext context, string jobId, JobResult result, string? errorMessage = null)
    {
        var jobStatus = new JobStatusEntity
        {
            JobId = jobId,
            Result = result,
            ExecutedAt = DateTime.UtcNow,
            ErrorMessage = errorMessage
        };

        context.JobStatuses.Add(jobStatus);
        await context.SaveChangesAsync();
    }
}

public class EndpointConfig
{
    public string Path { get; set; } = string.Empty;
    public string Method { get; set; } = string.Empty;
}
