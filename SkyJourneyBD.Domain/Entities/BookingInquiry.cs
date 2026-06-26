using SkyJourneyBD.Domain.Common;
using SkyJourneyBD.Domain.Enums;

namespace SkyJourneyBD.Domain.Entities;

public class BookingInquiry : BaseEntity
{
    public int? PackageId { get; set; }   // Package অথবা Hotel যেকোনো একটা থাকবে
    public int? HotelId { get; set; }

    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime? TravelDate { get; set; }
    public int Adults { get; set; } = 1;
    public int Children { get; set; } = 0;
    public string? Message { get; set; }

    public InquiryStatus Status { get; set; } = InquiryStatus.Pending;

    // Navigation properties
    public TourPackage? Package { get; set; }
    public Hotel? Hotel { get; set; }
}