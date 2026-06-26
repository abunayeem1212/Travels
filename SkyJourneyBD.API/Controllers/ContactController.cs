using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkyJourneyBD.API.Services;
using SkyJourneyBD.Application.DTOs.Contact;

namespace SkyJourneyBD.API.Controllers;

[ApiController]
[Route("api/contact")]
public class ContactController : ControllerBase
{
    private readonly ContactService _service;

    public ContactController(ContactService service) => _service = service;

    [HttpPost]
    public async Task<IActionResult> Submit(SubmitContactDto dto)
    {
        await _service.SubmitAsync(dto);
        return Ok(new { message = "Message sent successfully." });
    }

    [HttpGet]
    [Authorize(Roles = "SuperAdmin,Admin,Agent")]
    public async Task<IActionResult> GetAll([FromQuery] bool? unreadOnly)
        => Ok(await _service.GetAllAsync(unreadOnly));

    [HttpPost("{id}/reply")]
    [Authorize(Roles = "SuperAdmin,Admin,Agent")]
    public async Task<IActionResult> Reply(int id, [FromBody] string replyText)
    {
        var success = await _service.ReplyAsync(id, replyText);
        return success ? Ok(new { message = "Reply saved." }) : NotFound();
    }

    [HttpPatch("{id}/read")]
    [Authorize(Roles = "SuperAdmin,Admin,Agent")]
    public async Task<IActionResult> MarkRead(int id)
    {
        var success = await _service.MarkReadAsync(id);
        return success ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _service.DeleteAsync(id);
        return success ? NoContent() : NotFound();
    }
}