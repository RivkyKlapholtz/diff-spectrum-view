namespace DiffMonitor.Api.Data.Entities;

public class JobStatusEntity
{
    public int Id { get; set; }
    public string JobId { get; set; } = string.Empty;
    public JobResult Result { get; set; }
    public DateTime ExecutedAt { get; set; } = DateTime.UtcNow;
    public string? ErrorMessage { get; set; }
}

public enum JobResult
{
    SuccessNoDiff = 0,      // Job succeeded, responses are identical
    SuccessWithDiff = 1,     // Job succeeded, but found differences
    Failed = 2               // Job failed (network error, timeout, etc)
}
