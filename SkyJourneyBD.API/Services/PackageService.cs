using Microsoft.EntityFrameworkCore;
using SkyJourneyBD.Application.DTOs.Packages;
using SkyJourneyBD.Domain.Entities;
using SkyJourneyBD.Infrastructure.Data;

namespace SkyJourneyBD.API.Services;

public class PackageService
{
    private readonly AppDbContext _db;

    public PackageService(AppDbContext db) => _db = db;

    private static string GenerateSlug(string title)
        => title.ToLower().Replace(" ", "-").Replace("/", "-").Replace("&", "and");

    public async Task<List<PackageListDto>> GetPublicListAsync(bool? popularOnly = null)
    {
        var query = _db.TourPackages
            .Include(p => p.Images)
            .Where(p => p.IsActive);

        if (popularOnly == true)
            query = query.Where(p => p.IsPopular);

        return await query.Select(p => new PackageListDto
        {
            Id = p.Id,
            Title = p.Title,
            Slug = p.Slug,
            Location = p.Location,
            Price = p.Price,
            DiscountPrice = p.DiscountPrice,
            Duration = p.Duration,
            IsPopular = p.IsPopular,
            CoverImage = p.Images
                .Where(i => i.IsCover)
                .Select(i => i.ImageUrl)
                .FirstOrDefault()
        }).ToListAsync();
    }

    public async Task<PackageDetailDto?> GetBySlugAsync(string slug)
    {
        var p = await _db.TourPackages
            .Include(p => p.Images.OrderBy(i => i.DisplayOrder))
            .FirstOrDefaultAsync(p => p.Slug == slug && p.IsActive);

        if (p == null) return null;

        return new PackageDetailDto
        {
            Id = p.Id,
            Title = p.Title,
            Slug = p.Slug,
            Description = p.Description,
            Location = p.Location,
            Price = p.Price,
            DiscountPrice = p.DiscountPrice,
            Duration = p.Duration,
            Includes = p.Includes,
            Itinerary = p.Itinerary,
            IsPopular = p.IsPopular,
            Images = p.Images.Select(i => new PackageImageDto
            {
                Id = i.Id,
                ImageUrl = i.ImageUrl,
                IsCover = i.IsCover,
                DisplayOrder = i.DisplayOrder
            }).ToList()
        };
    }

    public async Task<List<PackageListDto>> GetAdminListAsync()
    {
        return await _db.TourPackages
            .Include(p => p.Images)
            .Select(p => new PackageListDto
            {
                Id = p.Id,
                Title = p.Title,
                Slug = p.Slug,
                Location = p.Location,
                Price = p.Price,
                DiscountPrice = p.DiscountPrice,
                Duration = p.Duration,
                IsPopular = p.IsPopular,
                CoverImage = p.Images
                    .Where(i => i.IsCover)
                    .Select(i => i.ImageUrl)
                    .FirstOrDefault()
            }).ToListAsync();
    }

    public async Task<TourPackage> CreateAsync(CreatePackageDto dto)
    {
        var package = new TourPackage
        {
            Title = dto.Title,
            Slug = GenerateSlug(dto.Title),
            Description = dto.Description,
            Price = dto.Price,
            DiscountPrice = dto.DiscountPrice,
            Duration = dto.Duration,
            Location = dto.Location,
            Includes = dto.Includes,
            Itinerary = dto.Itinerary,
            IsPopular = dto.IsPopular,
            IsActive = dto.IsActive
        };

        _db.TourPackages.Add(package);
        await _db.SaveChangesAsync();
        return package;
    }

    public async Task<bool> UpdateAsync(int id, CreatePackageDto dto)
    {
        var package = await _db.TourPackages.FindAsync(id);
        if (package == null) return false;

        package.Title = dto.Title;
        package.Slug = GenerateSlug(dto.Title);
        package.Description = dto.Description;
        package.Price = dto.Price;
        package.DiscountPrice = dto.DiscountPrice;
        package.Duration = dto.Duration;
        package.Location = dto.Location;
        package.Includes = dto.Includes;
        package.Itinerary = dto.Itinerary;
        package.IsPopular = dto.IsPopular;
        package.IsActive = dto.IsActive;
        package.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var package = await _db.TourPackages.FindAsync(id);
        if (package == null) return false;

        _db.TourPackages.Remove(package);
        await _db.SaveChangesAsync();
        return true;
    }
}