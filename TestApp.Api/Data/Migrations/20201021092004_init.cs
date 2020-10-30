using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TestApp.Api.Data.Migrations
{
    public partial class init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                "Attributes",
                table => new
                {
                    Id = table.Column<int>("int")
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>("nvarchar(100)", maxLength: 100)
                },
                constraints: table => { table.PrimaryKey("PK_Attributes", x => x.Id); });

            migrationBuilder.CreateTable(
                "Rooms",
                table => new
                {
                    Id = table.Column<int>("int")
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>("nvarchar(100)", maxLength: 100)
                },
                constraints: table => { table.PrimaryKey("PK_Rooms", x => x.Id); });

            migrationBuilder.CreateTable(
                "Users",
                table => new
                {
                    Id = table.Column<Guid>("uniqueidentifier"),
                    EmailAddress = table.Column<string>("nvarchar(100)", maxLength: 100),
                    FirstName = table.Column<string>("nvarchar(100)", maxLength: 100),
                    LastName = table.Column<string>("nvarchar(100)", maxLength: 100),
                    Password = table.Column<string>("nvarchar(1024)", maxLength: 1024),
                    IsGeneratedPassword = table.Column<bool>("bit")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id)
                        .Annotation("SqlServer:Clustered", false);
                });

            migrationBuilder.CreateTable(
                "Resouces",
                table => new
                {
                    Id = table.Column<Guid>("uniqueidentifier"),
                    Name = table.Column<string>("nvarchar(500)", maxLength: 500),
                    Quantity = table.Column<int>("int"),
                    OwnerId = table.Column<Guid>("uniqueidentifier", nullable: true),
                    RoomId = table.Column<int>("int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Resouces", x => x.Id)
                        .Annotation("SqlServer:Clustered", false);
                    table.ForeignKey(
                        "FK_Resouces_Rooms_RoomId",
                        x => x.RoomId,
                        "Rooms",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        "FK_Resouces_Users_OwnerId",
                        x => x.OwnerId,
                        "Users",
                        "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                "AttributeResource",
                table => new
                {
                    AttributesId = table.Column<int>("int"),
                    ResourcesId = table.Column<Guid>("uniqueidentifier")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AttributeResource", x => new {x.AttributesId, x.ResourcesId});
                    table.ForeignKey(
                        "FK_AttributeResource_Attributes_AttributesId",
                        x => x.AttributesId,
                        "Attributes",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_AttributeResource_Resouces_ResourcesId",
                        x => x.ResourcesId,
                        "Resouces",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                "IX_AttributeResource_ResourcesId",
                "AttributeResource",
                "ResourcesId");

            migrationBuilder.CreateIndex(
                "IX_Resouces_OwnerId",
                "Resouces",
                "OwnerId");

            migrationBuilder.CreateIndex(
                "IX_Resouces_RoomId",
                "Resouces",
                "RoomId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                "AttributeResource");

            migrationBuilder.DropTable(
                "Attributes");

            migrationBuilder.DropTable(
                "Resouces");

            migrationBuilder.DropTable(
                "Rooms");

            migrationBuilder.DropTable(
                "Users");
        }
    }
}