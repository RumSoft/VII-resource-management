using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;

namespace TestApp.Api.Models
{
    public class Resource : Entity<Guid>
    {
        public string Name { get; set; }
        public int Quantity { get; set; }
        public virtual User Owner { get; set; }
        public virtual IList<Attribute> Attributes { get; set; }
        public virtual Room Room { get; set; }

        public virtual bool IsLocked => TradeRequest != null;
        public virtual TradeRequest TradeRequest { get; set; }
    }
}