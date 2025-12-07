using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Top4Arena.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddHighestComboToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HighestCombo",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HighestCombo",
                table: "Users");
        }
    }
}
