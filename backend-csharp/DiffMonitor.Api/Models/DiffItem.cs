namespace DiffMonitor.Api.Models;

public class DiffItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Category { get; set; } = string.Empty;
    public string JobId { get; set; } = string.Empty;
    public string JobName { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string DiffType { get; set; } = string.Empty; // "status_code" or "body"
    public string ProdNormalizedResponse { get; set; } = string.Empty;
    public string IntegNormalizedResponse { get; set; } = string.Empty;
    public string? ProdIgnoredFields { get; set; }
    public string? IntegIgnoredFields { get; set; }
    public string ProdCurlRequest { get; set; } = string.Empty;
    public string IntegCurlRequest { get; set; } = string.Empty;
    public DiffMetadata? Metadata { get; set; }
    
    // Legacy fields for backward compatibility
    public string OldValue { get; set; } = string.Empty;
    public string NewValue { get; set; } = string.Empty;
}

public class DiffMetadata
{
    public string? Endpoint { get; set; }
    public string? Method { get; set; }
    public int? Duration { get; set; }
}
