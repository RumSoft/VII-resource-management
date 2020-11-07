using System;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace TestApp.Api.Models.Dto
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailAddress { get; set; }
    }

    public class ResourceDto : GuidName
    {
        public int Quantity { get; set; }
        public UserDto Owner { get; set; }
        public IdName Room { get; set; }
        public IdName[] Attributes { get; set; }
    }

    public class IdName
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class GuidName
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
}
