using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SkyJourneyBD.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAirTicketPackages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AirTicketPackages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AirlineName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FromCity = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ToCity = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TripType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FlightClass = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AirlineNameBn = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FromCityBn = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ToCityBn = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TripTypeBn = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FlightClassBn = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CheckedBaggageKg = table.Column<int>(type: "int", nullable: false),
                    CabinBaggageKg = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    DiscountPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    AirlineLogoUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PublicId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DescriptionBn = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsPopular = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AirTicketPackages", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AirTicketPackages");
        }
    }
}
