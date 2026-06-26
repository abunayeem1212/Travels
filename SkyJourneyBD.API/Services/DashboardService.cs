using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SkyJourneyBD.Application.DTOs.Dashboard;
using SkyJourneyBD.Domain.Entities;
using SkyJourneyBD.Domain.Enums;
using SkyJourneyBD.Infrastructure.Data;

namespace SkyJourneyBD.API.Services;

public class DashboardService
{
    private readonly AppDbContext _db;
    private readonly UserManager<ApplicationUser> _userManager;

    public DashboardService(AppDbContext db, UserManager<ApplicationUser> userManager)
    {
        _db = db;
        _userManager = userManager;
    }

    public async Task<DashboardStatsDto> GetStatsAsync()
    {
        var recentInquiries = await _db.BookingInquiries
            .Include(i => i.Package)
            .Include(i => i.Hotel)
            .OrderByDescending(i => i.CreatedAt)
            .Take(5)
            .Select(i => new RecentInquiryDto
            {
                Id = i.Id,
                Name = i.Name,
                Phone = i.Phone,
                Status = i.Status.ToString(),
                PackageOrHotel = i.Package != null ? i.Package.Title : i.Hotel != null ? i.Hotel.Name : null,
                CreatedAt = i.CreatedAt
            }).ToListAsync();

        var recentMessages = await _db.ContactMessages
            .OrderByDescending(m => m.CreatedAt)
            .Take(5)
            .Select(m => new RecentMessageDto
            {
                Id = m.Id,
                Name = m.Name,
                Subject = m.Subject,
                IsRead = m.IsRead,
                CreatedAt = m.CreatedAt
            }).ToListAsync();

        return new DashboardStatsDto
        {
            TotalPackages = await _db.TourPackages.CountAsync(),
            TotalHotels = await _db.Hotels.CountAsync(),
            TotalInquiries = await _db.BookingInquiries.CountAsync(),
            PendingInquiries = await _db.BookingInquiries
                .CountAsync(i => i.Status == InquiryStatus.Pending),
            TotalMessages = await _db.ContactMessages.CountAsync(),
            UnreadMessages = await _db.ContactMessages.CountAsync(m => !m.IsRead),
            TotalUsers = _userManager.Users.Count(),
            RecentInquiries = recentInquiries,
            RecentMessages = recentMessages
        };
    }
}