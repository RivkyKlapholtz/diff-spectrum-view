using DiffMonitor.Api.Models;
using DiffMonitor.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace DiffMonitor.Api.Controllers;

[ApiController]
[Route("api")]
public class DiffsController : ControllerBase
{
    private readonly IDiffService _diffService;
    private readonly IComparisonService _comparisonService;
    private readonly ILogger<DiffsController> _logger;

    public DiffsController(
        IDiffService diffService, 
        IComparisonService comparisonService,
        ILogger<DiffsController> logger)
    {
        _diffService = diffService;
        _comparisonService = comparisonService;
        _logger = logger;
    }

    [HttpPost("duplication")]
    public async Task<IActionResult> HandleDuplication([FromBody] DuplicationRequest request)
    {
        try
        {
            if (request == null || 
                string.IsNullOrWhiteSpace(request.TestUrl) || 
                string.IsNullOrWhiteSpace(request.SourceUrl))
            {
                return BadRequest("Invalid duplication request");
            }

            var result = await _comparisonService.CompareDuplicatedRequestAsync(request);

            if (!string.IsNullOrEmpty(result.ErrorMessage))
            {
                _logger.LogError("Error processing duplication: {Error}", result.ErrorMessage);
                return StatusCode(500, result.ErrorMessage);
            }

            if (result.HasDifference && result.Diff != null)
            {
                await _diffService.SaveDiffAsync(result.Diff);
            }

            return Ok(new { hasDifference = result.HasDifference });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error handling duplication request");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("jobsStatus")]
    public async Task<ActionResult<JobsStatus>> GetJobsStatus()
    {
        try
        {
            var status = await _diffService.GetJobsStatusAsync();
            return Ok(status);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting jobs status");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("diffsByType")]
    public async Task<ActionResult<List<string>>> GetDiffsByType([FromQuery] string type)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(type))
            {
                return BadRequest("Type parameter is required");
            }

            var diffIds = await _diffService.GetDiffIdsByTypeAsync(type);
            return Ok(diffIds);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting diffs by type: {Type}", type);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("diffDetailes")]
    public async Task<ActionResult<DiffItem>> GetDiffDetails([FromQuery] string id)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return BadRequest("Id parameter is required");
            }

            var diff = await _diffService.GetDiffDetailsAsync(id);
            
            if (diff == null)
            {
                return NotFound($"Diff with id '{id}' not found");
            }

            return Ok(diff);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting diff details for id: {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }
}
