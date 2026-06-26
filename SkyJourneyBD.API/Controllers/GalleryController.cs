using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkyJourneyBD.API.Services;
using SkyJourneyBD.Domain.Enums;
using SkyJourneyBD.Infrastructure.Data;
using SkyJourneyBD.Infrastructure.Services;

namespace SkyJourneyBD.API.Controllers;

public class CreateGalleryRequest
{
    public string Title { get; set; } = string.Empty;
    public MediaType MediaType { get; set; } = MediaType.Photo;
    public string? Category { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public IFormFile? File { get; set; }
    public string? VideoUrl { get; set; } // YouTube URL
}

[ApiController]
[Route("api/gallery")]
public class GalleryController : ControllerBase
{
    private readonly GalleryService _service;
    private readonly CloudinaryService _cloudinary;
    private readonly AppDbContext _db;

    public GalleryController(
        GalleryService service,
        CloudinaryService cloudinary,
        AppDbContext db)
    {
        _service = service;
        _cloudinary = cloudinary;
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetPublic(
        [FromQuery] string? category, [FromQuery] string? type)
        => Ok(await _service.GetPublicAsync(category, type));

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _db.Galleries
            .Where(g => g.IsActive && g.Category != null)
            .Select(g => g.Category!)
            .Distinct()
            .ToListAsync();
        return Ok(categories);
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,Admin,Agent")]
    public async Task<IActionResult> Create([FromForm] CreateGalleryRequest req)
    {
        string url;
        string? publicId = null;

        if (req.MediaType == MediaType.Video && !string.IsNullOrEmpty(req.VideoUrl))
        {
            // YouTube URL directly save করো
            url = req.VideoUrl;
        }
        else if (req.File != null)
        {
            if (req.MediaType == MediaType.Video)
            {
                (url, publicId) = await _cloudinary.UploadVideoAsync(
                    req.File.OpenReadStream(),
                    req.File.FileName,
                    "skyjourneybd/videos");
            }
            else
            {
                (url, publicId) = await _cloudinary.UploadImageAsync(
                    req.File.OpenReadStream(),
                    req.File.FileName,
                    "skyjourneybd/gallery");
            }
        }
        else
        {
            return BadRequest(new { message = "File or Video URL required" });
        }

        var item = new SkyJourneyBD.Domain.Entities.Gallery
        {
            Title = req.Title,
            MediaUrl = url,
            PublicId = publicId,
            MediaType = req.MediaType,
            Category = req.Category,
            DisplayOrder = req.DisplayOrder,
            IsActive = req.IsActive
        };

        _db.Galleries.Add(item);
        await _db.SaveChangesAsync();
        return Ok(item);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _service.DeleteAsync(id, _cloudinary);
        return success ? NoContent() : NotFound();
    }
}