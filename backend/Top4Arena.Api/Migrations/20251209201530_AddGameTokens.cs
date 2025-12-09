using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Top4Arena.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddGameTokens : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GameTokens",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Used = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GameTokens_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GameTokens_CreatedAt",
                table: "GameTokens",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_GameTokens_ExpiresAt",
                table: "GameTokens",
                column: "ExpiresAt");

            migrationBuilder.CreateIndex(
                name: "IX_GameTokens_Used",
                table: "GameTokens",
                column: "Used");

            migrationBuilder.CreateIndex(
                name: "IX_GameTokens_UserId",
                table: "GameTokens",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GameTokens");
        }
    }
}
