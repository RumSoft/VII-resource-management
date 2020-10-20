using System.Collections;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TestApp.Api.Models.Base;

namespace TestApp.Api.Models
{
    public class Room : Entity<int>
    {
        public string Name { get; set; }
        public virtual IList<Resource> Resources { get; set; }
    }
}