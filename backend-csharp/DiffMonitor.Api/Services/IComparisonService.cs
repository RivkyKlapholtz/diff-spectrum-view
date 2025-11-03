using DiffMonitor.Api.Models;

namespace DiffMonitor.Api.Services;

public interface IComparisonService
{
    Task<ComparisonResult> CompareEndpointsAsync(string endpoint, string method);
    Task<ComparisonResult> CompareDuplicatedRequestAsync(DuplicationRequest request);
}

public class ComparisonResult
{
    public bool HasDifference { get; set; }
    public DiffItem? Diff { get; set; }
    public string? ErrorMessage { get; set; }
}
