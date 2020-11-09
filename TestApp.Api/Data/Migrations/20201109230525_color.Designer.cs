﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TestApp.Api.Data;

namespace TestApp.Api.Data.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20201109230525_color")]
    partial class color
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .UseIdentityColumns()
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.0-rc.2.20475.6");

            modelBuilder.Entity("AttributeResource", b =>
                {
                    b.Property<int>("AttributesId")
                        .HasColumnType("int");

                    b.Property<Guid>("ResourcesId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("AttributesId", "ResourcesId");

                    b.HasIndex("ResourcesId");

                    b.ToTable("AttributeResource");
                });

            modelBuilder.Entity("TestApp.Api.Models.Attribute", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .UseIdentityColumn();

                    b.Property<string>("Color")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("Attributes");
                });

            modelBuilder.Entity("TestApp.Api.Models.Resource", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");

                    b.Property<Guid?>("OwnerId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("Quantity")
                        .HasColumnType("int");

                    b.Property<int?>("RoomId")
                        .HasColumnType("int");

                    b.HasKey("Id")
                        .IsClustered(false);

                    b.HasIndex("OwnerId");

                    b.HasIndex("RoomId");

                    b.ToTable("Resources");
                });

            modelBuilder.Entity("TestApp.Api.Models.Room", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .UseIdentityColumn();

                    b.Property<string>("Color")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("Rooms");
                });

            modelBuilder.Entity("TestApp.Api.Models.Token", b =>
                {
                    b.Property<string>("Value")
                        .HasMaxLength(150)
                        .HasColumnType("nvarchar(150)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("ExpiresAt")
                        .HasColumnType("datetime2");

                    b.Property<bool>("IsUsed")
                        .HasColumnType("bit");

                    b.Property<Guid>("ParentId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("Type")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasDefaultValue(0);

                    b.HasKey("Value")
                        .IsClustered(false);

                    b.ToTable("Tokens");
                });

            modelBuilder.Entity("TestApp.Api.Models.TradeRequest", b =>
                {
                    b.Property<Guid>("Id")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("TakerId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id")
                        .IsClustered(false);

                    b.HasIndex("TakerId");

                    b.ToTable("TradeRequests");
                });

            modelBuilder.Entity("TestApp.Api.Models.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("EmailAddress")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<bool>("IsGeneratedPassword")
                        .HasColumnType("bit");

                    b.Property<DateTime?>("LastLoginAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasDefaultValueSql("getdate()");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(1024)
                        .HasColumnType("nvarchar(1024)");

                    b.Property<DateTime>("RegisteredAt")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasDefaultValueSql("getdate()");

                    b.Property<string>("Role")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)")
                        .HasDefaultValue("User");

                    b.HasKey("Id")
                        .IsClustered(false);

                    b.HasIndex("EmailAddress")
                        .IsUnique();

                    b.ToTable("Users");
                });

            modelBuilder.Entity("AttributeResource", b =>
                {
                    b.HasOne("TestApp.Api.Models.Attribute", null)
                        .WithMany()
                        .HasForeignKey("AttributesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("TestApp.Api.Models.Resource", null)
                        .WithMany()
                        .HasForeignKey("ResourcesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("TestApp.Api.Models.Resource", b =>
                {
                    b.HasOne("TestApp.Api.Models.User", "Owner")
                        .WithMany("Resources")
                        .HasForeignKey("OwnerId");

                    b.HasOne("TestApp.Api.Models.Room", "Room")
                        .WithMany("Resources")
                        .HasForeignKey("RoomId");

                    b.Navigation("Owner");

                    b.Navigation("Room");
                });

            modelBuilder.Entity("TestApp.Api.Models.TradeRequest", b =>
                {
                    b.HasOne("TestApp.Api.Models.Resource", "Resource")
                        .WithOne("TradeRequest")
                        .HasForeignKey("TestApp.Api.Models.TradeRequest", "Id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("TestApp.Api.Models.User", "Taker")
                        .WithMany("IncomingTradeRequests")
                        .HasForeignKey("TakerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Resource");

                    b.Navigation("Taker");
                });

            modelBuilder.Entity("TestApp.Api.Models.Resource", b =>
                {
                    b.Navigation("TradeRequest");
                });

            modelBuilder.Entity("TestApp.Api.Models.Room", b =>
                {
                    b.Navigation("Resources");
                });

            modelBuilder.Entity("TestApp.Api.Models.User", b =>
                {
                    b.Navigation("IncomingTradeRequests");

                    b.Navigation("Resources");
                });
#pragma warning restore 612, 618
        }
    }
}
