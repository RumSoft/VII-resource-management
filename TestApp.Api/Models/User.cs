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

        public virtual IList<Resource> Resources { get; set; }

        public string FullName => $"{FirstName} {LastName}";
    }
}