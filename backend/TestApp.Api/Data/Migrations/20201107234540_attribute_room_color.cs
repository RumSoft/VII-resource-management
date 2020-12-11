using Microsoft.EntityFrameworkCore.Migrations;

namespace TestApp.Api.Data.Migrations
{
    public partial class attribute_room_color : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Color",
                table: "Rooms",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Color",
                table: "Rooms");
        }
    }
}
