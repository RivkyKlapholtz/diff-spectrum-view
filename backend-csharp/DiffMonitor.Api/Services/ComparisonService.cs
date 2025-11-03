using DiffMonitor.Api.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net.Http.Headers;
using System.Text;

namespace DiffMonitor.Api.Services;

public class ComparisonService : IComparisonService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<ComparisonService> _logger;

    public ComparisonService(
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<ComparisonService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<ComparisonResult> CompareEndpointsAsync(string endpoint, string method)
    {
        try
        {
            var prodBaseUrl = _configuration["ApiConfiguration:ProductionBaseUrl"];
            var integBaseUrl = _configuration["ApiConfiguration:IntegrationBaseUrl"];

            if (string.IsNullOrEmpty(prodBaseUrl) || string.IsNullOrEmpty(integBaseUrl))
            {
                return new ComparisonResult
                {
                    HasDifference = false,
                    ErrorMessage = "API base URLs not configured"
                };
            }

            var prodUrl = $"{prodBaseUrl}{endpoint}";
            var integUrl = $"{integBaseUrl}{endpoint}";

            var startTime = DateTime.UtcNow;

            // Make requests
            var prodResponse = await MakeRequestAsync(prodUrl, method);
            var integResponse = await MakeRequestAsync(integUrl, method);

            var duration = (int)(DateTime.UtcNow - startTime).TotalMilliseconds;

            // Compare status codes
            if (prodResponse.StatusCode != integResponse.StatusCode)
            {
                var diff = CreateDiff(
                    endpoint,
                    method,
                    duration,
                    "status_code",
                    prodResponse,
                    integResponse,
                    prodUrl,
                    integUrl
                );

                return new ComparisonResult
                {
                    HasDifference = true,
                    Diff = diff
                };
            }

            // Compare response bodies (JSON)
            if (prodResponse.IsJson && integResponse.IsJson)
            {
                var prodNormalized = NormalizeJson(prodResponse.Body);
                var integNormalized = NormalizeJson(integResponse.Body);

                if (prodNormalized != integNormalized)
                {
                    var diff = CreateDiff(
                        endpoint,
                        method,
                        duration,
                        "json_response",
                        prodResponse,
                        integResponse,
                        prodUrl,
                        integUrl
                    );

                    return new ComparisonResult
                    {
                        HasDifference = true,
                        Diff = diff
                    };
                }
            }

            return new ComparisonResult
            {
                HasDifference = false
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error comparing endpoints: {Endpoint}", endpoint);
            return new ComparisonResult
            {
                HasDifference = false,
                ErrorMessage = ex.Message
            };
        }
    }

    public async Task<ComparisonResult> CompareDuplicatedRequestAsync(DuplicationRequest request)
    {
        try
        {
            var startTime = DateTime.UtcNow;

            // Make request to test URL
            var testResponse = await MakeRequestAsync(request.TestUrl, "POST", request.Content);

            var duration = (int)(DateTime.UtcNow - startTime).TotalMilliseconds;

            // Parse expected response (from source/production)
            var sourceResponse = new ApiResponse
            {
                StatusCode = 200, // Assuming success from flapi
                Body = request.ExpectedResponse,
                IsJson = true
            };

            // Extract endpoint and method from URLs
            var endpoint = ExtractEndpoint(request.TestUrl);
            var method = "POST";

            // Compare status codes
            if (testResponse.StatusCode != sourceResponse.StatusCode)
            {
                var diff = CreateDiff(
                    endpoint,
                    method,
                    duration,
                    "status_code",
                    sourceResponse,
                    testResponse,
                    request.SourceUrl,
                    request.TestUrl
                );

                return new ComparisonResult
                {
                    HasDifference = true,
                    Diff = diff
                };
            }

            // Compare response bodies (JSON)
            if (testResponse.IsJson && sourceResponse.IsJson)
            {
                var sourceNormalized = NormalizeJson(sourceResponse.Body);
                var testNormalized = NormalizeJson(testResponse.Body);

                if (sourceNormalized != testNormalized)
                {
                    var diff = CreateDiff(
                        endpoint,
                        method,
                        duration,
                        "json_response",
                        sourceResponse,
                        testResponse,
                        request.SourceUrl,
                        request.TestUrl
                    );

                    return new ComparisonResult
                    {
                        HasDifference = true,
                        Diff = diff
                    };
                }
            }

            return new ComparisonResult
            {
                HasDifference = false
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error comparing duplicated request");
            return new ComparisonResult
            {
                HasDifference = false,
                ErrorMessage = ex.Message
            };
        }
    }

    private string ExtractEndpoint(string url)
    {
        try
        {
            var uri = new Uri(url);
            return uri.PathAndQuery;
        }
        catch
        {
            return url;
        }
    }

    private async Task<ApiResponse> MakeRequestAsync(string url, string method, string? content = null)
    {
        var request = new HttpRequestMessage(new HttpMethod(method), url);
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        if (!string.IsNullOrEmpty(content))
        {
            request.Content = new StringContent(content, Encoding.UTF8, "application/json");
        }

        var response = await _httpClient.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        var isJson = response.Content.Headers.ContentType?.MediaType == "application/json";

        return new ApiResponse
        {
            StatusCode = (int)response.StatusCode,
            Body = body,
            IsJson = isJson
        };
    }

    private string NormalizeJson(string json)
    {
        try
        {
            var obj = JToken.Parse(json);
            return obj.ToString(Formatting.None);
        }
        catch
        {
            return json;
        }
    }

    private DiffItem CreateDiff(
        string endpoint,
        string method,
        int duration,
        string category,
        ApiResponse prodResponse,
        ApiResponse integResponse,
        string prodUrl,
        string integUrl)
    {
        var jobId = Guid.NewGuid().ToString();
        var diffType = category == "status_code" ? "status_code" : "body";

        var prodCurl = GenerateCurlCommand(prodUrl, method, prodResponse);
        var integCurl = GenerateCurlCommand(integUrl, method, integResponse);

        var prodValue = diffType == "status_code" 
            ? prodResponse.StatusCode.ToString() 
            : FormatJson(prodResponse.Body);

        var integValue = diffType == "status_code"
            ? integResponse.StatusCode.ToString()
            : FormatJson(integResponse.Body);

        return new DiffItem
        {
            Id = Guid.NewGuid().ToString(),
            Category = category,
            JobId = jobId,
            JobName = $"{method} {endpoint}",
            Timestamp = DateTime.UtcNow,
            DiffType = diffType,
            ProdNormalizedResponse = prodValue,
            IntegNormalizedResponse = integValue,
            ProdCurlRequest = prodCurl,
            IntegCurlRequest = integCurl,
            OldValue = prodValue,
            NewValue = integValue,
            Metadata = new DiffMetadata
            {
                Endpoint = endpoint,
                Method = method,
                Duration = duration
            }
        };
    }

    private string GenerateCurlCommand(string url, string method, ApiResponse response)
    {
        var sb = new StringBuilder();
        sb.AppendLine($"curl -X {method} '{url}' \\");
        sb.AppendLine("  -H 'Content-Type: application/json' \\");
        sb.Append("  -H 'Accept: application/json'");
        return sb.ToString();
    }

    private string FormatJson(string json)
    {
        try
        {
            var obj = JToken.Parse(json);
            return obj.ToString(Formatting.Indented);
        }
        catch
        {
            return json;
        }
    }

    private class ApiResponse
    {
        public int StatusCode { get; set; }
        public string Body { get; set; } = string.Empty;
        public bool IsJson { get; set; }
    }
}
