using System.Runtime.CompilerServices;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TestApp.Api.Models.Base;

namespace TestApp.Api.Models
{
    public class Todo : TimeStampedEntity
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public bool IsDone { get; set; }

        public static void Build(EntityTypeBuilder<Todo> entity)
        {
            TimeStampedEntity.Build(entity);
        }
    }
}