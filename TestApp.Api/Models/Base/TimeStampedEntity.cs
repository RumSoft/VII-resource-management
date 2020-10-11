using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace TestApp.Api.Models.Base
{
    public abstract class TimeStampedEntity : Entity
    {
        public DateTime? CreatedAt { get; }
        public DateTime? ModifiedAt { get; }

        public static void Build(EntityTypeBuilder entity)
        {
            Entity.Build(entity);

            entity.Property<DateTime?>(nameof(CreatedAt))
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAdd();

            entity.Property<DateTime?>(nameof(ModifiedAt))
                .HasDefaultValueSql("GETDATE()")
                .ValueGeneratedOnUpdate();
        }
    }
}