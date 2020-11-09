using System.Collections.Generic;

namespace TestApp.Api.Models
{
    public class Room : Entity<int>
    {
        public string Name { get; set; }
        public string Color { get; set; }
        public virtual IList<Resource> Resources { get; set; }
    }
}