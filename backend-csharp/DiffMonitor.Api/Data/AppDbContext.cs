using DiffMonitor.Api.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace DiffMonitor.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<DiffEntity> Diffs { get; set; }
    public DbSet<JobStatusEntity> JobStatuses { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<DiffEntity>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Category).IsRequired();
            entity.Property(e => e.JobId).IsRequired();
            entity.HasIndex(e => e.Category);
            entity.HasIndex(e => e.JobId);
        });

        modelBuilder.Entity<JobStatusEntity>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.JobId).IsRequired();
            entity.HasIndex(e => e.JobId).IsUnique();
        });
    }
}
