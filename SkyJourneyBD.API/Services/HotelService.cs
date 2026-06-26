using Microsoft.EntityFrameworkCore;
using SkyJourneyBD.Application.DTOs.Hotels;
using SkyJourneyBD.Domain.Entities;
using SkyJourneyBD.Infrastructure.Data;
using SkyJourneyBD.Infrastructure.Services;

namespace SkyJourneyBD.API.Services;

public class HotelService
{
    private readonly AppDbContext _db;

    public HotelService(AppDbContext db) => _db = db;

    private static string GenerateSlug(string name)
        => name.ToLower().Replace(" ", "-").Replace("/", "-").Replace("&", "and");

    public async Task<List<HotelListDto>> GetPublicListAsync(string? location = null, int? stars = null)
    {
        var query = _db.Hotels
            .Include(h => h.Images)
            .Where(h => h.IsActive);

        if (!string.IsNullOrEmpty(location))
            query = query.Where(h => h.Location.Contains(location));

        if (stars.HasValue)
            query = query.Where(h => h.StarRating == stars.Value);

        return await query.Select(h => new HotelListDto
        {
            Id = h.Id,
            Name = h.Name,
            Slug = h.Slug,
            Location = h.Location,
            StarRating = h.StarRating,
            PricePerNight = h.PricePerNight,
            CoverImage = h.Images
                .Where(i => i.IsCover)
                .Select(i => i.ImageUrl)
                .FirstOrDefault()
        }).ToListAsync();
    }

    public async Task<HotelDetailDto?> GetBySlugAsync(string slug)
    {
        var h = await _db.Hotels
            .Include(h => h.Images.OrderBy(i => i.DisplayOrder))
            .FirstOrDefaultAsync(h => h.Slug == slug && h.IsActive);

        if (h == null) return null;

        return new HotelDetailDto
        {
            Id = h.Id,
            Name = h.Name,
            Slug = h.Slug,
            Location = h.Location,
            StarRating = h.StarRating,
            PricePerNight = h.PricePerNight,
            Description = h.Description,
            Amenities = h.Amenities,
            Images = h.Images.Select(i => new HotelImageDto
            {
                Id = i.Id,
                ImageUrl = i.ImageUrl,
                IsCover = i.IsCover
            }).ToList()
        };
    }

    public async Task<List<HotelListDto>> GetAdminListAsync()
    {
        return await _db.Hotels
            .Include(h => h.Images)
            .Select(h => new HotelListDto
            {
                Id = h.Id,
                Name = h.Name,
                Slug = h.Slug,
                Location = h.Location,
                StarRating = h.StarRating,
                PricePerNight = h.PricePerNight,
                CoverImage = h.Images
                    .Where(i => i.IsCover)
                    .Select(i => i.ImageUrl)
                    .FirstOrDefault()
            }).ToListAsync();
    }

    public async Task<Hotel> CreateAsync(CreateHotelDto dto)
    {
        var hotel = new Hotel
        {
            Name = dto.Name,
            Slug = dto.Name.ToLower().Replace(" ", "-"),
            Location = dto.Location,
            StarRating = dto.StarRating,
            PricePerNight = dto.PricePerNight,
            Description = dto.Description,
            Amenities = dto.Amenities,
            IsActive = dto.IsActive
        };

        _db.Hotels.Add(hotel);
        await _db.SaveChangesAsync();
        return hotel;
    }

    public async Task<bool> UpdateAsync(int id, CreateHotelDto dto)
    {
        var hotel = await _db.Hotels.FindAsync(id);
        if (hotel == null) return false;

        hotel.Name = dto.Name;
        hotel.Slug = dto.Name.ToLower().Replace(" ", "-");
        hotel.Location = dto.Location;
        hotel.StarRating = dto.StarRating;
        hotel.PricePerNight = dto.PricePerNight;
        hotel.Description = dto.Description;
        hotel.Amenities = dto.Amenities;
        hotel.IsActive = dto.IsActive;
        hotel.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var hotel = await _db.Hotels.FindAsync(id);
        if (hotel == null) return false;

        _db.Hotels.Remove(hotel);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<List<object>> UploadImagesAsync(
        int id, List<IFormFile> images, CloudinaryService cloudinary)
    {
        var hotel = await _db.Hotels
            .Include(h => h.Images)
            .FirstOrDefaultAsync(h => h.Id == id);

        if (hotel == null) return new List<object>();

        var uploaded = new List<object>();
        bool firstImage = !hotel.Images.Any();

        foreach (var file in images)
        {
            using var stream = file.OpenReadStream();
            (string url, string publicId) result = await cloudinary.UploadImageAsync(
    stream, file.FileName, "skyjourneybd/hotels");

            var image = new HotelImage
            {
                HotelId = id,
                ImageUrl = result.url,
                PublicId = result.publicId,
                IsCover = firstImage,
                DisplayOrder = hotel.Images.Count
            };

            _db.HotelImages.Add(image);
            firstImage = false;
            uploaded.Add(new { image.Id, image.ImageUrl, image.IsCover });
        }

        await _db.SaveChangesAsync();
        return uploaded;
    }
}