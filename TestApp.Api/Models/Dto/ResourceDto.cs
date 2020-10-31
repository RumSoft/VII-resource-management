using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestApp.Api.Models.Dto
{
    public class ResourceDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int Quantity { get; set; }
        public virtual UserDto Owner { get; set; }
        public virtual List<AttributeDto> Attributes { get; set; }
        public virtual RoomDto Room { get; set; }
    }

    public class CreateResourceDto
    {
        public string Name { get; set; }
        public int Quantity { get; set; }
        public List<int> Attributes { get; set; }
        public int? Room { get; set; }
    }
}
