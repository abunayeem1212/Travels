using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkyJourneyBD.Application.DTOs.Inquiry;

public class InquiryListDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime? TravelDate { get; set; }
    public int Adults { get; set; }
    public int Children { get; set; }
    public string? Message { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string? PackageTitle { get; set; }   // কোন package এর inquiry
    public string? HotelName { get; set; }      // অথবা কোন hotel এর
}
