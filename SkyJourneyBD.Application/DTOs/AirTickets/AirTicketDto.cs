using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkyJourneyBD.Application.DTOs.AirTickets;

public class AirTicketListDto
{
    public int Id { get; set; }

    public string AirlineName { get; set; } = string.Empty;
    public string FromCity { get; set; } = string.Empty;
    public string ToCity { get; set; } = string.Empty;
    public string TripType { get; set; } = string.Empty;
    public string FlightClass { get; set; } = string.Empty;

    public string AirlineNameBn { get; set; } = string.Empty;
    public string FromCityBn { get; set; } = string.Empty;
    public string ToCityBn { get; set; } = string.Empty;
    public string TripTypeBn { get; set; } = string.Empty;
    public string FlightClassBn { get; set; } = string.Empty;

    public int CheckedBaggageKg { get; set; }
    public int CabinBaggageKg { get; set; }

    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }

    public string? AirlineLogoUrl { get; set; }
    public bool IsPopular { get; set; }
}

public class AirTicketDetailDto : AirTicketListDto
{
    public string? Description { get; set; }
    public string? DescriptionBn { get; set; }
}

public class CreateAirTicketDto
{
    public string AirlineName { get; set; } = string.Empty;
    public string FromCity { get; set; } = string.Empty;
    public string ToCity { get; set; } = string.Empty;
    public string TripType { get; set; } = string.Empty;
    public string FlightClass { get; set; } = string.Empty;

    public string AirlineNameBn { get; set; } = string.Empty;
    public string FromCityBn { get; set; } = string.Empty;
    public string ToCityBn { get; set; } = string.Empty;
    public string TripTypeBn { get; set; } = string.Empty;
    public string FlightClassBn { get; set; } = string.Empty;

    public int CheckedBaggageKg { get; set; }
    public int CabinBaggageKg { get; set; }

    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }

    public string? Description { get; set; }
    public string? DescriptionBn { get; set; }

    public bool IsPopular { get; set; }
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; }
}
