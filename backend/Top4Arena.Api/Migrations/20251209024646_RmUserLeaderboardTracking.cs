using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Top4Arena.Api.Migrations
{
    /// <inheritdoc />
    public partial class RmUserLeaderboardTracking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastGameAt",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "LastGameRound",
                table: "Users");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastGameAt",
                table: "Users",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LastGameRound",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
