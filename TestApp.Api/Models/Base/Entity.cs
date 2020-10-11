using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace TestApp.Api.Models.Base
{
    public abstract class Entity
    {
        public Guid Id { get; set; }

        public static void Build(EntityTypeBuilder entity)
        {
            entity.Property<Guid>(nameof(Id))
                .ValueGeneratedOnAdd();

            entity.HasKey(nameof(Id))
                .IsClustered(false);
        }
    }
}