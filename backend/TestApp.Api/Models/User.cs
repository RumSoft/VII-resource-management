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

        public DateTime RegisteredAt { get; set; }
        public DateTime? LastLoginAt { get; set; }

        public virtual IList<Resource> Resources { get; set; }
        
        public virtual IList<TradeRequest> IncomingTradeRequests { get; set; }

        public string FullName => $"{FirstName} {LastName}";
    }

    public class UserRoles
    {
        public const string Admin = "Admin";
        public const string User = "User";
    }
}