using System.Collections.Generic;

namespace TestApp.Api.Models
{
    public class Attribute : Entity<int>
    {
        public string Name { get; set; }
        public virtual IList<Resource> Resources { get; set; }
    }
}