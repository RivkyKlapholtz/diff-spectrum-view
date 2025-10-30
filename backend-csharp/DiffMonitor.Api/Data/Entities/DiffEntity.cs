namespace DiffMonitor.Api.Data.Entities;

public class DiffEntity
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Category { get; set; } = string.Empty;
    public string JobId { get; set; } = string.Empty;
    public string JobName { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string DiffType { get; set; } = string.Empty;
    public string ProdNormalizedResponse { get; set; } = string.Empty;
    public string IntegNormalizedResponse { get; set; } = string.Empty;
    public string? ProdIgnoredFields { get; set; }
    public string? IntegIgnoredFields { get; set; }
    public string ProdCurlRequest { get; set; } = string.Empty;
    public string IntegCurlRequest { get; set; } = string.Empty;
    public string? MetadataJson { get; set; }
    public string OldValue { get; set; } = string.Empty;
    public string NewValue { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
