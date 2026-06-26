namespace SkyJourneyBD.Application.DTOs.Inquiry;

public class SubmitInquiryDto
{
    public int? PackageId { get; set; }
    public int? HotelId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime? TravelDate { get; set; }
    public int Adults { get; set; } = 1;
    public int Children { get; set; } = 0;
    public string? Message { get; set; }
}