using Microsoft.EntityFrameworkCore;
using SkyJourneyBD.Application.DTOs.Banners;
using SkyJourneyBD.Domain.Entities;
using SkyJourneyBD.Infrastructure.Data;
using SkyJourneyBD.Infrastructure.Services;

namespace SkyJourneyBD.API.Services;

public class BannerService
{
    private readonly AppDbContext _db;

    public BannerService(AppDbContext db) => _db = db;

    public async Task<List<BannerDto>> GetActiveAsync()
    {
        return await _db.Banners
            .Where(b => b.IsActive)
            .OrderBy(b => b.DisplayOrder)
            .Select(b => new BannerDto
            {
                Id = b.Id,
                Title = b.Title,
                Subtitle = b.Subtitle,
                ImageUrl = b.ImageUrl,
                LinkUrl = b.LinkUrl,
                DisplayOrder = b.DisplayOrder,
                IsActive = b.IsActive
            }).ToListAsync();
    }

    public async Task<List<BannerDto>> GetAllAsync()
    {
        return await _db.Banners
            .OrderBy(b => b.DisplayOrder)
            .Select(b => new BannerDto
            {
                Id = b.Id,
                Title = b.Title,
                Subtitle = b.Subtitle,
                ImageUrl = b.ImageUrl,
                LinkUrl = b.LinkUrl,
                DisplayOrder = b.DisplayOrder,
                IsActive = b.IsActive
            }).ToListAsync();
    }

    public async Task<Banner> CreateAsync(
        CreateBannerDto dto, IFormFile image, CloudinaryService cloudinary)
    {
        var (url, publicId) = await cloudinary.UploadImageAsync(
            image.OpenReadStream(), image.FileName, "skyjourneybd/banners");

        var banner = new Banner
        {
            Title = dto.Title,
            Subtitle = dto.Subtitle,
            ImageUrl = url,
            PublicId = publicId,
            LinkUrl = dto.LinkUrl,
            DisplayOrder = dto.DisplayOrder,
            IsActive = dto.IsActive
        };

        _db.Banners.Add(banner);
        await _db.SaveChangesAsync();
        return banner;
    }

    public async Task<bool> ToggleActiveAsync(int id)
    {
        var banner = await _db.Banners.FindAsync(id);
        if (banner == null) return false;

        banner.IsActive = !banner.IsActive;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id, CloudinaryService cloudinary)
    {
        var banner = await _db.Banners.FindAsync(id);
        if (banner == null) return false;

        if (!string.IsNullOrEmpty(banner.PublicId))
            await cloudinary.DeleteImageAsync(banner.PublicId);

        _db.Banners.Remove(banner);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<Banner> CreateDirectAsync(Banner banner)
    {
        _db.Banners.Add(banner);
        await _db.SaveChangesAsync();
        return banner;
    }

}