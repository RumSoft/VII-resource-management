using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TestApp.Api.Data.Migrations
{
    public partial class password_reset_token : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                "Tokens",
                table => new
                {
                    Value = table.Column<string>("nvarchar(150)", maxLength: 150),
                    CreatedAt = table.Column<DateTime>("datetime2"),
                    ExpiresAt = table.Column<DateTime>("datetime2"),
                    IsUsed = table.Column<bool>("bit"),
                    Type = table.Column<int>("int", nullable: false, defaultValue: 0),
                    ParentId = table.Column<Guid>("uniqueidentifier")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tokens", x => x.Value)
                        .Annotation("SqlServer:Clustered", false);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                "Tokens");
        }
    }
}