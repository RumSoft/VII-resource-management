using System;
using System.Drawing;

namespace TestApp.Api.Models.Dto
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailAddress { get; set; }
        public string Role { get; set; }
    }

    public class ResourceDto : GuidName
    {
        public int Quantity { get; set; }
        public UserDto Owner { get; set; }
        public IdNameColor Room { get; set; }
        public IdNameColor[] Attributes { get; set; }
    }

    public class IdNameColor
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
    }

    public class GuidName
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
}
