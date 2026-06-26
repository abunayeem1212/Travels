using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkyJourneyBD.API.Services;
using SkyJourneyBD.Application.DTOs.Inquiry;
using SkyJourneyBD.Domain.Enums;

namespace SkyJourneyBD.API.Controllers;

[ApiController]
[Route("api/inquiries")]
public class InquiryController : ControllerBase
{
    private readonly InquiryService _service;

    public InquiryController(InquiryService service) => _service = service;

    [HttpPost]
    public async Task<IActionResult> Submit(SubmitInquiryDto dto)
    {
        await _service.SubmitAsync(dto);
        return Ok(new { message = "Inquiry submitted successfully." });
    }

    [HttpGet]
    [Authorize(Roles = "SuperAdmin,Admin,Agent")]
    public async Task<IActionResult> GetAll([FromQuery] InquiryStatus? status)
        => Ok(await _service.GetAllAsync(status));

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "SuperAdmin,Admin,Agent")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] InquiryStatus status)
    {
        var success = await _service.UpdateStatusAsync(id, status);
        return success ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _service.DeleteAsync(id);
        return success ? NoContent() : NotFound();
    }
}