using DiffMonitor.Api.Models;

namespace DiffMonitor.Api.Services;

public interface IDiffService
{
    Task<JobsStatus> GetJobsStatusAsync();
    Task<List<string>> GetDiffIdsByTypeAsync(string type);
    Task<DiffItem?> GetDiffDetailsAsync(string id);
    Task SaveDiffAsync(DiffItem diff);
}
