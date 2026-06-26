using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkyJourneyBD.API.Services;
using SkyJourneyBD.Infrastructure.Services;

namespace SkyJourneyBD.API.Controllers;

public class CreateBannerRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string? LinkUrl { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public IFormFile Image { get; set; } = null!;
}

[ApiController]
[Route("api/banners")]
public class BannersController : ControllerBase
{
    private readonly BannerService _service;
    private readonly CloudinaryService _cloudinary;

    public BannersController(BannerService service, CloudinaryService cloudinary)
    {
        _service = service;
        _cloudinary = cloudinary;
    }

    [HttpGet]
    public async Task<IActionResult> GetActive()
        => Ok(await _service.GetActiveAsync());

    [HttpGet("all")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> GetAll()
        => Ok(await _service.GetAllAsync());

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> Create([FromForm] CreateBannerRequest req)
    {
        var (url, publicId) = await _cloudinary.UploadImageAsync(
            req.Image.OpenReadStream(), req.Image.FileName, "skyjourneybd/banners");

        var banner = new SkyJourneyBD.Domain.Entities.Banner
        {
            Title = req.Title,
            Subtitle = req.Subtitle,
            ImageUrl = url,
            PublicId = publicId,
            LinkUrl = req.LinkUrl,
            DisplayOrder = req.DisplayOrder,
            IsActive = req.IsActive
        };

        var result = await _service.CreateDirectAsync(banner);
        return Ok(result);
    }

    [HttpPatch("{id}/toggle")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> Toggle(int id)
    {
        var success = await _service.ToggleActiveAsync(id);
        return success ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _service.DeleteAsync(id, _cloudinary);
        return success ? NoContent() : NotFound();
    }
}