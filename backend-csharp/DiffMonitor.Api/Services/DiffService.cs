using DiffMonitor.Api.Data;
using DiffMonitor.Api.Data.Entities;
using DiffMonitor.Api.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace DiffMonitor.Api.Services;

public class DiffService : IDiffService
{
    private readonly AppDbContext _context;
    private readonly ILogger<DiffService> _logger;

    public DiffService(AppDbContext context, ILogger<DiffService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<JobsStatus> GetJobsStatusAsync()
    {
        var jobStatuses = await _context.JobStatuses.ToListAsync();
        
        var failedJobs = jobStatuses.Count(j => j.Result == JobResult.Failed);
        var successedDiffs = jobStatuses.Count(j => j.Result == JobResult.SuccessNoDiff);
        var failedDiffs = jobStatuses.Count(j => j.Result == JobResult.SuccessWithDiff);
        var jobCounter = jobStatuses.Count;

        return new JobsStatus
        {
            FailedJobs = failedJobs,
            SuccessedDiffs = successedDiffs,
            FailedDiffs = failedDiffs,
            JobCounter = jobCounter
        };
    }

    public async Task<List<string>> GetDiffIdsByTypeAsync(string type)
    {
        var query = _context.Diffs.AsQueryable();

        if (type != "deleted_diffs")
        {
            query = query.Where(d => d.Category == type);
        }

        var diffIds = await query
            .OrderByDescending(d => d.Timestamp)
            .Select(d => d.Id)
            .ToListAsync();

        return diffIds;
    }

    public async Task<DiffItem?> GetDiffDetailsAsync(string id)
    {
        var entity = await _context.Diffs.FirstOrDefaultAsync(d => d.Id == id);
        
        if (entity == null)
        {
            return null;
        }

        return MapToModel(entity);
    }

    public async Task SaveDiffAsync(DiffItem diff)
    {
        var entity = MapToEntity(diff);
        _context.Diffs.Add(entity);
        await _context.SaveChangesAsync();
    }

    private DiffItem MapToModel(DiffEntity entity)
    {
        DiffMetadata? metadata = null;
        if (!string.IsNullOrEmpty(entity.MetadataJson))
        {
            try
            {
                metadata = JsonConvert.DeserializeObject<DiffMetadata>(entity.MetadataJson);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to deserialize metadata for diff {Id}", entity.Id);
            }
        }

        return new DiffItem
        {
            Id = entity.Id,
            Category = entity.Category,
            JobId = entity.JobId,
            JobName = entity.JobName,
            Timestamp = entity.Timestamp,
            DiffType = entity.DiffType,
            ProdNormalizedResponse = entity.ProdNormalizedResponse,
            IntegNormalizedResponse = entity.IntegNormalizedResponse,
            ProdIgnoredFields = entity.ProdIgnoredFields,
            IntegIgnoredFields = entity.IntegIgnoredFields,
            ProdCurlRequest = entity.ProdCurlRequest,
            IntegCurlRequest = entity.IntegCurlRequest,
            Metadata = metadata,
            OldValue = entity.OldValue,
            NewValue = entity.NewValue
        };
    }

    private DiffEntity MapToEntity(DiffItem model)
    {
        string? metadataJson = null;
        if (model.Metadata != null)
        {
            metadataJson = JsonConvert.SerializeObject(model.Metadata);
        }

        return new DiffEntity
        {
            Id = model.Id,
            Category = model.Category,
            JobId = model.JobId,
            JobName = model.JobName,
            Timestamp = model.Timestamp,
            DiffType = model.DiffType,
            ProdNormalizedResponse = model.ProdNormalizedResponse,
            IntegNormalizedResponse = model.IntegNormalizedResponse,
            ProdIgnoredFields = model.ProdIgnoredFields,
            IntegIgnoredFields = model.IntegIgnoredFields,
            ProdCurlRequest = model.ProdCurlRequest,
            IntegCurlRequest = model.IntegCurlRequest,
            MetadataJson = metadataJson,
            OldValue = model.OldValue,
            NewValue = model.NewValue
        };
    }
}
