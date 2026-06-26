using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkyJourneyBD.Application.DTOs.Dashboard;

public class DashboardStatsDto
{
    public int TotalPackages { get; set; }
    public int TotalHotels { get; set; }
    public int TotalInquiries { get; set; }
    public int PendingInquiries { get; set; }
    public int TotalMessages { get; set; }
    public int UnreadMessages { get; set; }
    public int TotalUsers { get; set; }
    public List<RecentInquiryDto> RecentInquiries { get; set; } = new();
    public List<RecentMessageDto> RecentMessages { get; set; } = new();
}

public class RecentInquiryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? PackageOrHotel { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class RecentMessageDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
}
