using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestApp.Api.Models
{
    public class Token
    {
        public string Value { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public bool IsUsed { get; set; }
        public TokenType Type { get; set; }
        public Guid ParentId { get; set; }
    }

    public enum TokenType
    {
        Unknown = 0,
        PasswordReset = 1
    }
}
