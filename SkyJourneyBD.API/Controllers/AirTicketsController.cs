using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkyJourneyBD.API.Services;
using SkyJourneyBD.Application.DTOs.AirTickets;
using SkyJourneyBD.Infrastructure.Services;

namespace SkyJourneyBD.API.Controllers;

[ApiController]
[Route("api/airtickets")]
public class AirTicketsController : ControllerBase
{
    private readonly AirTicketService _service;
    private readonly CloudinaryService _cloudinary;

    public AirTicketsController(
        AirTicketService service, CloudinaryService cloudinary)
    {
        _service = service;
        _cloudinary = cloudinary;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] bool? popular)
        => Ok(await _service.GetPublicListAsync(popular));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        return result == null ? NotFound() : Ok(result);
    }

    [HttpGet("admin/all")]
    [Authorize(Roles = "SuperAdmin,Admin,Moderator,Agent")]
    public async Task<IActionResult> GetAdminList()
        => Ok(await _service.GetAdminListAsync());

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,Admin,Moderator,Agent")]
    public async Task<IActionResult> Create(CreateAirTicketDto dto)
    {
        var ticket = await _service.CreateAsync(dto);
        return Ok(ticket);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "SuperAdmin,Admin,Moderator,Agent")]
    public async Task<IActionResult> Update(int id, CreateAirTicketDto dto)
    {
        var success = await _service.UpdateAsync(id, dto);
        return success ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _service.DeleteAsync(id);
        return success ? NoContent() : NotFound();
    }

    [HttpPost("{id}/logo")]
    [Authorize(Roles = "SuperAdmin,Admin,Moderator,Agent")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadLogo(int id, [FromForm] IFormFile logo)
    {
        var success = await _service.UploadLogoAsync(id, logo, _cloudinary);
        return success ? Ok(new { message = "Logo uploaded" }) : NotFound();
    }
}