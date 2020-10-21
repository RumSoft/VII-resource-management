using System.Security.Cryptography.X509Certificates;
using Microsoft.EntityFrameworkCore;

namespace TestApp.Api.Models
{
    public class DataContext : DbContext
    {

        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {
        }

        public DbSet<Resource> Resouces { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Attribute> Attributes { get; set; }
        //public DbSet<TradeRequest> TradeRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var resource = modelBuilder.Entity<Resource>();
            resource.HasKey(x => x.Id).IsClustered(false);
            resource.Property(x => x.Name).IsRequired().HasMaxLength(500);
            resource.HasMany(x => x.Attributes)
                .WithMany(x => x.Resources);
            resource.HasOne(x => x.Owner)
                .WithMany(x => x.Resources);
            resource.HasOne(x => x.Room)
                .WithMany(x => x.Resources);

            var user = modelBuilder.Entity<User>();
            user.HasKey(x => x.Id).IsClustered(false);
            user.Property(x => x.FirstName).IsRequired().HasMaxLength(100);
            user.Property(x => x.LastName).IsRequired().HasMaxLength(100);
            user.Property(x => x.EmailAddress).IsRequired().HasMaxLength(100);
            user.Property(x => x.Password).IsRequired().HasMaxLength(1024);

            var attrib = modelBuilder.Entity<Attribute>();
            attrib.HasKey(x => x.Id);
            attrib.Property(x => x.Name).IsRequired().HasMaxLength(100);

            var room = modelBuilder.Entity<Room>();
            room.HasKey(x => x.Id);
            room.Property(x => x.Name).IsRequired().HasMaxLength(100);

        }
    }
}