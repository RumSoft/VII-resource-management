using System;
using System.Security.Cryptography.X509Certificates;
using Microsoft.EntityFrameworkCore;
using TestApp.Api.Models;
using Attribute = TestApp.Api.Models.Attribute;

namespace TestApp.Api.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {
        }

        public DbSet<Resource> Resources { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Attribute> Attributes { get; set; }

        public DbSet<Token> Tokens { get; set; }
        
        public DbSet<TradeRequest> TradeRequests { get; set; }

        public DbSet<LogObject> Log { get; set; }
        
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
            user.Property(x => x.Role).IsRequired().HasMaxLength(50).HasDefaultValue(UserRoles.User);
            user.Property(x => x.RegisteredAt).HasDefaultValueSql("getdate()").ValueGeneratedOnAdd();
            user.Property(x => x.LastLoginAt).HasDefaultValueSql("getdate()");
            user.HasIndex(x => x.EmailAddress).IsUnique();


            var attrib = modelBuilder.Entity<Attribute>();
            attrib.HasKey(x => x.Id);
            attrib.Property(x => x.Name).IsRequired().HasMaxLength(100);
            attrib.HasIndex(x => x.Name).IsUnique();

            var room = modelBuilder.Entity<Room>();
            room.HasKey(x => x.Id);
            room.Property(x => x.Name).IsRequired().HasMaxLength(100);
            room.HasIndex(x => x.Name).IsUnique();

            var token = modelBuilder.Entity<Token>();
            token.HasKey(x => x.Value).IsClustered(false);
            token.Property(x => x.Value).HasMaxLength(150);
            token.Property(x => x.Type).HasDefaultValue(TokenType.Unknown);

            var tr = modelBuilder.Entity<TradeRequest>();
            tr.HasKey(x => x.Id).IsClustered(false);
            tr.HasOne(x => x.Taker).WithMany(x => x.IncomingTradeRequests).IsRequired();
            tr.HasOne(x => x.Resource)
                .WithOne(x => x.TradeRequest)
                .HasForeignKey<TradeRequest>(x => x.Id)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}