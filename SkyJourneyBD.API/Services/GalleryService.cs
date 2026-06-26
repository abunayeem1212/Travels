using Microsoft.EntityFrameworkCore;
using SkyJourneyBD.Application.DTOs.Gallery;
using SkyJourneyBD.Domain.Entities;
using SkyJourneyBD.Infrastructure.Data;
using SkyJourneyBD.Infrastructure.Services;

namespace SkyJourneyBD.API.Services;

public class GalleryService
{
    private readonly AppDbContext _db;

    public GalleryService(AppDbContext db) => _db = db;

    public async Task<List<GalleryItemDto>> GetPublicAsync(string? category = null, string? type = null)
    {
        var query = _db.Galleries.Where(g => g.IsActive);

        if (!string.IsNullOrEmpty(category))
            query = query.Where(g => g.Category == category);

        if (!string.IsNullOrEmpty(type) &&
            Enum.TryParse<Domain.Enums.MediaType>(type, true, out var mediaType))
            query = query.Where(g => g.MediaType == mediaType);

        return await query
            .OrderBy(g => g.DisplayOrder)
            .Select(g => new GalleryItemDto
            {
                Id = g.Id,
                Title = g.Title,
                MediaUrl = g.MediaUrl,
                MediaType = g.MediaType.ToString(),
                Category = g.Category,
                DisplayOrder = g.DisplayOrder
            }).ToListAsync();
    }

    public async Task<Gallery> CreateAsync(
        CreateGalleryDto dto, IFormFile file, CloudinaryService cloudinary)
    {
        var (url, publicId) = await cloudinary.UploadImageAsync(
            file.OpenReadStream(), file.FileName, "skyjourneybd/gallery");

        var item = new Gallery
        {
            Title = dto.Title,
            MediaUrl = url,
            PublicId = publicId,
            MediaType = dto.MediaType,
            Category = dto.Category,
            DisplayOrder = dto.DisplayOrder,
            IsActive = dto.IsActive
        };

        _db.Galleries.Add(item);
        await _db.SaveChangesAsync();
        return item;
    }

    public async Task<bool> DeleteAsync(int id, CloudinaryService cloudinary)
    {
        var item = await _db.Galleries.FindAsync(id);
        if (item == null) return false;

        if (!string.IsNullOrEmpty(item.PublicId))
            await cloudinary.DeleteImageAsync(item.PublicId);

        _db.Galleries.Remove(item);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<Gallery> CreateDirectAsync(Gallery item)
    {
        _db.Galleries.Add(item);
        await _db.SaveChangesAsync();
        return item;
    }
}