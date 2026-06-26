using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkyJourneyBD.API.Services;
using SkyJourneyBD.Application.DTOs.Hotels;
using SkyJourneyBD.Infrastructure.Services;

namespace SkyJourneyBD.API.Controllers;

[ApiController]
[Route("api/hotels")]
public class HotelsController : ControllerBase
{
    private readonly HotelService _service;
    private readonly CloudinaryService _cloudinary;

    public HotelsController(HotelService service, CloudinaryService cloudinary)
    {
        _service = service;
        _cloudinary = cloudinary;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? location, [FromQuery] int? stars)
        => Ok(await _service.GetPublicListAsync(location, stars));

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var result = await _service.GetBySlugAsync(slug);
        return result == null ? NotFound() : Ok(result);
    }

    [HttpGet("admin/all")]
    [Authorize(Roles = "SuperAdmin,Admin,Agent")]
    public async Task<IActionResult> GetAdminList()
        => Ok(await _service.GetAdminListAsync());

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,Admin,Agent")]
    public async Task<IActionResult> Create(CreateHotelDto dto)
    {
        var hotel = await _service.CreateAsync(dto);
        return Ok(hotel);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "SuperAdmin,Admin,Agent")]
    public async Task<IActionResult> Update(int id, CreateHotelDto dto)
    {
        var success = await _service.UpdateAsync(id, dto);
        return success ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _service.DeleteAsync(id);
        return success ? NoContent() : NotFound();
    }

    [HttpPost("{id}/images")]
    [Authorize(Roles = "SuperAdmin,Admin,Agent")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadImages(
        int id, [FromForm] List<IFormFile> images)
    {
        var result = await _service.UploadImagesAsync(id, images, _cloudinary);
        return result.Count == 0 ? NotFound() : Ok(result);
    }
}