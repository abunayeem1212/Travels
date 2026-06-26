using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkyJourneyBD.Application.DTOs.Packages;
using SkyJourneyBD.API.Services;              // ← এখন API.Services থেকে
using SkyJourneyBD.Domain.Entities;
using SkyJourneyBD.Infrastructure.Data;
using SkyJourneyBD.Infrastructure.Services;

namespace SkyJourneyBD.API.Controllers;

[ApiController]
[Route("api/packages")]
public class PackagesController : ControllerBase
{
    private readonly PackageService _service;
    private readonly AppDbContext _db;

    public PackagesController(PackageService service, AppDbContext db)
    {
        _service = service;
        _db = db;                                // ← এটা add করো
    }
    // GET /api/packages?popular=true
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] bool? popular)
        => Ok(await _service.GetPublicListAsync(popular));

    // GET /api/packages/cox-s-bazar-tour
    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var result = await _service.GetBySlugAsync(slug);
        return result == null ? NotFound() : Ok(result);
    }

    // Admin endpoints
    [HttpGet("admin/all")]
    [Authorize(Roles = "SuperAdmin,Admin,Moderator,Agent")]
    public async Task<IActionResult> GetAdminList()
        => Ok(await _service.GetAdminListAsync());

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,Admin,Moderator,Agent")]
    public async Task<IActionResult> Create(CreatePackageDto dto)
    {
        var package = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetBySlug), new { slug = package.Slug }, package);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "SuperAdmin,Admin,Moderator,Agent")]
    public async Task<IActionResult> Update(int id, CreatePackageDto dto)
    {
        var success = await _service.UpdateAsync(id, dto);
        return success ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "SuperAdmin,Admin")]   // শুধু SuperAdmin/Admin delete করতে পারবে
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _service.DeleteAsync(id);
        return success ? NoContent() : NotFound();
    }

    [HttpPost("{id}/images")]
    [Authorize(Roles = "SuperAdmin,Admin,Agent")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadImages(
        int id,
        [FromForm] List<IFormFile> images,
        [FromServices] CloudinaryService cloudinary)
    {
        var package = await _db.TourPackages
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (package == null) return NotFound();

        var uploadedImages = new List<object>();
        bool firstImage = !package.Images.Any();

        foreach (var file in images)
        {
            using var stream = file.OpenReadStream();
            (string url, string publicId) result = await cloudinary.UploadImageAsync(
    stream, file.FileName, "skyjourneybd/packages");

            var image = new PackageImage
            {
                PackageId = id,
                ImageUrl = result.url,
                PublicId = result.publicId,
                IsCover = firstImage,
                DisplayOrder = package.Images.Count
            };

            _db.PackageImages.Add(image);
            firstImage = false;
            uploadedImages.Add(new { image.Id, image.ImageUrl, image.IsCover });
        }

        await _db.SaveChangesAsync();
        return Ok(uploadedImages);
    }

}