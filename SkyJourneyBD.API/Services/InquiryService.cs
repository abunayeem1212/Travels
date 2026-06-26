using Microsoft.EntityFrameworkCore;
using SkyJourneyBD.Application.DTOs.Inquiry;
using SkyJourneyBD.Domain.Entities;
using SkyJourneyBD.Domain.Enums;
using SkyJourneyBD.Infrastructure.Data;

namespace SkyJourneyBD.API.Services;

public class InquiryService
{
    private readonly AppDbContext _db;

    public InquiryService(AppDbContext db) => _db = db;

    public async Task SubmitAsync(SubmitInquiryDto dto)
    {
        var inquiry = new BookingInquiry
        {
            PackageId = dto.PackageId,
            HotelId = dto.HotelId,
            Name = dto.Name,
            Phone = dto.Phone,
            Email = dto.Email,
            TravelDate = dto.TravelDate,
            Adults = dto.Adults,
            Children = dto.Children,
            Message = dto.Message,
            Status = InquiryStatus.Pending
        };

        _db.BookingInquiries.Add(inquiry);
        await _db.SaveChangesAsync();
    }

    public async Task<List<InquiryListDto>> GetAllAsync(InquiryStatus? status = null)
    {
        var query = _db.BookingInquiries
            .Include(i => i.Package)
            .Include(i => i.Hotel)
            .AsQueryable();

        if (status.HasValue)
            query = query.Where(i => i.Status == status.Value);

        return await query
            .OrderByDescending(i => i.CreatedAt)
            .Select(i => new InquiryListDto
            {
                Id = i.Id,
                Name = i.Name,
                Phone = i.Phone,
                Email = i.Email,
                TravelDate = i.TravelDate,
                Adults = i.Adults,
                Children = i.Children,
                Message = i.Message,
                Status = i.Status.ToString(),
                CreatedAt = i.CreatedAt,
                PackageTitle = i.Package != null ? i.Package.Title : null,
                HotelName = i.Hotel != null ? i.Hotel.Name : null
            }).ToListAsync();
    }

    public async Task<bool> UpdateStatusAsync(int id, InquiryStatus status)
    {
        var inquiry = await _db.BookingInquiries.FindAsync(id);
        if (inquiry == null) return false;

        inquiry.Status = status;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var inquiry = await _db.BookingInquiries.FindAsync(id);
        if (inquiry == null) return false;

        _db.BookingInquiries.Remove(inquiry);
        await _db.SaveChangesAsync();
        return true;
    }
}