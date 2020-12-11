using Microsoft.EntityFrameworkCore.Migrations;

namespace TestApp.Api.Data.Migrations
{
    public partial class create_unique_indexes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                "IX_Users_EmailAddress",
                "Users",
                "EmailAddress",
                unique: true);

            migrationBuilder.CreateIndex(
                "IX_Rooms_Name",
                "Rooms",
                "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                "IX_Attributes_Name",
                "Attributes",
                "Name",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                "IX_Users_EmailAddress",
                "Users");

            migrationBuilder.DropIndex(
                "IX_Rooms_Name",
                "Rooms");

            migrationBuilder.DropIndex(
                "IX_Attributes_Name",
                "Attributes");
        }
    }
}