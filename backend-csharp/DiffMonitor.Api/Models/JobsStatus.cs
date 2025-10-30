namespace DiffMonitor.Api.Models;

public class JobsStatus
{
    public int FailedDiffs { get; set; }
    public int SuccessedDiffs { get; set; }
    public int FailedJobs { get; set; }
    public int JobCounter { get; set; }
}
