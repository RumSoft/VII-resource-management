using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TestApp.Api.Data.Migrations
{
    public partial class trade_request2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FinalizedAt",
                table: "TradeRequests");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "TradeRequests");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "FinalizedAt",
                table: "TradeRequests",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "TradeRequests",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
