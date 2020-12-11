using Microsoft.EntityFrameworkCore.Migrations;

namespace TestApp.Api.Data.Migrations
{
    public partial class Init2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_AttributeResource_Resouces_ResourcesId",
                "AttributeResource");

            migrationBuilder.DropForeignKey(
                "FK_Resouces_Rooms_RoomId",
                "Resouces");

            migrationBuilder.DropForeignKey(
                "FK_Resouces_Users_OwnerId",
                "Resouces");

            migrationBuilder.DropPrimaryKey(
                "PK_Resouces",
                "Resouces");

            migrationBuilder.RenameTable(
                "Resouces",
                newName: "Resources");

            migrationBuilder.RenameIndex(
                "IX_Resouces_RoomId",
                table: "Resources",
                newName: "IX_Resources_RoomId");

            migrationBuilder.RenameIndex(
                "IX_Resouces_OwnerId",
                table: "Resources",
                newName: "IX_Resources_OwnerId");

            migrationBuilder.AddColumn<string>(
                "Role",
                "Users",
                "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "User");

            migrationBuilder.AddPrimaryKey(
                    "PK_Resources",
                    "Resources",
                    "Id")
                .Annotation("SqlServer:Clustered", false);

            migrationBuilder.AddForeignKey(
                "FK_AttributeResource_Resources_ResourcesId",
                "AttributeResource",
                "ResourcesId",
                "Resources",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                "FK_Resources_Rooms_RoomId",
                "Resources",
                "RoomId",
                "Rooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                "FK_Resources_Users_OwnerId",
                "Resources",
                "OwnerId",
                "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                "FK_AttributeResource_Resources_ResourcesId",
                "AttributeResource");

            migrationBuilder.DropForeignKey(
                "FK_Resources_Rooms_RoomId",
                "Resources");

            migrationBuilder.DropForeignKey(
                "FK_Resources_Users_OwnerId",
                "Resources");

            migrationBuilder.DropPrimaryKey(
                "PK_Resources",
                "Resources");

            migrationBuilder.DropColumn(
                "Role",
                "Users");

            migrationBuilder.RenameTable(
                "Resources",
                newName: "Resouces");

            migrationBuilder.RenameIndex(
                "IX_Resources_RoomId",
                table: "Resouces",
                newName: "IX_Resouces_RoomId");

            migrationBuilder.RenameIndex(
                "IX_Resources_OwnerId",
                table: "Resouces",
                newName: "IX_Resouces_OwnerId");

            migrationBuilder.AddPrimaryKey(
                    "PK_Resouces",
                    "Resouces",
                    "Id")
                .Annotation("SqlServer:Clustered", false);

            migrationBuilder.AddForeignKey(
                "FK_AttributeResource_Resouces_ResourcesId",
                "AttributeResource",
                "ResourcesId",
                "Resouces",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                "FK_Resouces_Rooms_RoomId",
                "Resouces",
                "RoomId",
                "Rooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                "FK_Resouces_Users_OwnerId",
                "Resouces",
                "OwnerId",
                "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}