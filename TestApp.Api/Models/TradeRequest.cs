using System;

namespace TestApp.Api.Models
{
    public class TradeRequest : Entity<Guid>
    {
        public virtual Resource Resource { get; set; }
        public virtual User Taker { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}