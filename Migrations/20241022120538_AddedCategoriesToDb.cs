using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace incubis_assignment.Migrations
{
    public partial class AddedCategoriesToDb : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Phones",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Emails",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Phones");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "Emails");
        }
    }
}
