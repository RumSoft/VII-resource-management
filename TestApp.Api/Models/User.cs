using System;
using System.Collections.Generic;

namespace TestApp.Api.Models
{
    public class User : Entity<Guid>
    {
        public string EmailAddress { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Password { get; set; }
        public bool IsGeneratedPassword { get; set; }
        public string Role { get; set; }

        //todo:
        //public DateTime lastActivity;
        //public DateTime lastLogin;

        public virtual IList<Resource> Resources { get; set; }

        public string FullName => $"{FirstName} {LastName}";
    }

    public class Roles
    {
        public const string Admin = "Admin";
        public const string User = "User";
    }
}