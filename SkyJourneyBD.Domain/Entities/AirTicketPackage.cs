using SkyJourneyBD.Domain.Common;

namespace SkyJourneyBD.Domain.Entities;

public class AirTicketPackage : BaseEntity
{
    // English fields
    public string AirlineName { get; set; } = string.Empty;
    public string FromCity { get; set; } = string.Empty;
    public string ToCity { get; set; } = string.Empty;
    public string TripType { get; set; } = string.Empty;   // One Way / Round Trip
    public string FlightClass { get; set; } = string.Empty; // Economy / Business

    // Bangla fields
    public string AirlineNameBn { get; set; } = string.Empty;
    public string FromCityBn { get; set; } = string.Empty;
    public string ToCityBn { get; set; } = string.Empty;
    public string TripTypeBn { get; set; } = string.Empty;
    public string FlightClassBn { get; set; } = string.Empty;

    // Baggage info
    public int CheckedBaggageKg { get; set; }   // চেক-ইন ব্যাগেজ
    public int CabinBaggageKg { get; set; }     // ক্যাবিন ব্যাগেজ

    // Pricing
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }

    // Media
    public string? AirlineLogoUrl { get; set; }
    public string? PublicId { get; set; }

    public string? Description { get; set; }
    public string? DescriptionBn { get; set; }

    public bool IsPopular { get; set; }
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; }
}