using Microsoft.EntityFrameworkCore;
using SkyJourneyBD.Application.DTOs.AirTickets;
using SkyJourneyBD.Domain.Entities;
using SkyJourneyBD.Infrastructure.Data;
using SkyJourneyBD.Infrastructure.Services;

namespace SkyJourneyBD.API.Services;

public class AirTicketService
{
    private readonly AppDbContext _db;

    public AirTicketService(AppDbContext db) => _db = db;

    public async Task<List<AirTicketListDto>> GetPublicListAsync(bool? popularOnly = null)
    {
        var query = _db.AirTicketPackages.Where(a => a.IsActive);

        if (popularOnly == true)
            query = query.Where(a => a.IsPopular);

        return await query
            .OrderBy(a => a.DisplayOrder)
            .Select(a => MapToList(a))
            .ToListAsync();
    }

    public async Task<List<AirTicketListDto>> GetAdminListAsync()
    {
        return await _db.AirTicketPackages
            .OrderBy(a => a.DisplayOrder)
            .Select(a => MapToList(a))
            .ToListAsync();
    }

    public async Task<AirTicketDetailDto?> GetByIdAsync(int id)
    {
        var a = await _db.AirTicketPackages.FindAsync(id);
        if (a == null) return null;

        return new AirTicketDetailDto
        {
            Id = a.Id,
            AirlineName = a.AirlineName,
            FromCity = a.FromCity,
            ToCity = a.ToCity,
            TripType = a.TripType,
            FlightClass = a.FlightClass,
            AirlineNameBn = a.AirlineNameBn,
            FromCityBn = a.FromCityBn,
            ToCityBn = a.ToCityBn,
            TripTypeBn = a.TripTypeBn,
            FlightClassBn = a.FlightClassBn,
            CheckedBaggageKg = a.CheckedBaggageKg,
            CabinBaggageKg = a.CabinBaggageKg,
            Price = a.Price,
            DiscountPrice = a.DiscountPrice,
            AirlineLogoUrl = a.AirlineLogoUrl,
            IsPopular = a.IsPopular,
            Description = a.Description,
            DescriptionBn = a.DescriptionBn
        };
    }

    public async Task<AirTicketPackage> CreateAsync(CreateAirTicketDto dto)
    {
        var ticket = new AirTicketPackage
        {
            AirlineName = dto.AirlineName,
            FromCity = dto.FromCity,
            ToCity = dto.ToCity,
            TripType = dto.TripType,
            FlightClass = dto.FlightClass,
            AirlineNameBn = dto.AirlineNameBn,
            FromCityBn = dto.FromCityBn,
            ToCityBn = dto.ToCityBn,
            TripTypeBn = dto.TripTypeBn,
            FlightClassBn = dto.FlightClassBn,
            CheckedBaggageKg = dto.CheckedBaggageKg,
            CabinBaggageKg = dto.CabinBaggageKg,
            Price = dto.Price,
            DiscountPrice = dto.DiscountPrice,
            Description = dto.Description,
            DescriptionBn = dto.DescriptionBn,
            IsPopular = dto.IsPopular,
            IsActive = dto.IsActive,
            DisplayOrder = dto.DisplayOrder
        };

        _db.AirTicketPackages.Add(ticket);
        await _db.SaveChangesAsync();
        return ticket;
    }

    public async Task<bool> UpdateAsync(int id, CreateAirTicketDto dto)
    {
        var ticket = await _db.AirTicketPackages.FindAsync(id);
        if (ticket == null) return false;

        ticket.AirlineName = dto.AirlineName;
        ticket.FromCity = dto.FromCity;
        ticket.ToCity = dto.ToCity;
        ticket.TripType = dto.TripType;
        ticket.FlightClass = dto.FlightClass;
        ticket.AirlineNameBn = dto.AirlineNameBn;
        ticket.FromCityBn = dto.FromCityBn;
        ticket.ToCityBn = dto.ToCityBn;
        ticket.TripTypeBn = dto.TripTypeBn;
        ticket.FlightClassBn = dto.FlightClassBn;
        ticket.CheckedBaggageKg = dto.CheckedBaggageKg;
        ticket.CabinBaggageKg = dto.CabinBaggageKg;
        ticket.Price = dto.Price;
        ticket.DiscountPrice = dto.DiscountPrice;
        ticket.Description = dto.Description;
        ticket.DescriptionBn = dto.DescriptionBn;
        ticket.IsPopular = dto.IsPopular;
        ticket.IsActive = dto.IsActive;
        ticket.DisplayOrder = dto.DisplayOrder;
        ticket.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var ticket = await _db.AirTicketPackages.FindAsync(id);
        if (ticket == null) return false;

        _db.AirTicketPackages.Remove(ticket);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UploadLogoAsync(
        int id, IFormFile logo, CloudinaryService cloudinary)
    {
        var ticket = await _db.AirTicketPackages.FindAsync(id);
        if (ticket == null) return false;

        if (!string.IsNullOrEmpty(ticket.PublicId))
            await cloudinary.DeleteImageAsync(ticket.PublicId);

        var (url, publicId) = await cloudinary.UploadImageAsync(
            logo.OpenReadStream(), logo.FileName, "skyjourneybd/airlines");

        ticket.AirlineLogoUrl = url;
        ticket.PublicId = publicId;

        await _db.SaveChangesAsync();
        return true;
    }

    private static AirTicketListDto MapToList(AirTicketPackage a) => new()
    {
        Id = a.Id,
        AirlineName = a.AirlineName,
        FromCity = a.FromCity,
        ToCity = a.ToCity,
        TripType = a.TripType,
        FlightClass = a.FlightClass,
        AirlineNameBn = a.AirlineNameBn,
        FromCityBn = a.FromCityBn,
        ToCityBn = a.ToCityBn,
        TripTypeBn = a.TripTypeBn,
        FlightClassBn = a.FlightClassBn,
        CheckedBaggageKg = a.CheckedBaggageKg,
        CabinBaggageKg = a.CabinBaggageKg,
        Price = a.Price,
        DiscountPrice = a.DiscountPrice,
        AirlineLogoUrl = a.AirlineLogoUrl,
        IsPopular = a.IsPopular
    };
}