namespace DiffMonitor.Api.Models;

public class DuplicationRequest
{
    public string TestUrl { get; set; } = string.Empty;
    public string SourceUrl { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string ExpectedResponse { get; set; } = string.Empty;
    public DuplicationOptions? Options { get; set; }
}

public class DuplicationOptions
{
    public bool AllowSemanticCompresion { get; set; }
}
