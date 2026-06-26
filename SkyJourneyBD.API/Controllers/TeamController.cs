using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkyJourneyBD.API.Services;
using SkyJourneyBD.Infrastructure.Services;

namespace SkyJourneyBD.API.Controllers;

public class CreateTeamRequest
{
    public string Name { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public string? FacebookUrl { get; set; }
    public string? LinkedInUrl { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public IFormFile? Photo { get; set; }
}

[ApiController]
[Route("api/team")]
public class TeamController : ControllerBase
{
    private readonly TeamService _service;
    private readonly CloudinaryService _cloudinary;

    public TeamController(TeamService service, CloudinaryService cloudinary)
    {
        _service = service;
        _cloudinary = cloudinary;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _service.GetAllAsync());

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> Create([FromForm] CreateTeamRequest req)
    {
        string? photoUrl = null;
        string? publicId = null;

        if (req.Photo != null)
        {
            (photoUrl, publicId) = await _cloudinary.UploadImageAsync(
                req.Photo.OpenReadStream(), req.Photo.FileName, "skyjourneybd/team");
        }

        var member = new SkyJourneyBD.Domain.Entities.TeamMember
        {
            Name = req.Name,
            Designation = req.Designation,
            PhotoUrl = photoUrl,
            PublicId = publicId,
            FacebookUrl = req.FacebookUrl,
            LinkedInUrl = req.LinkedInUrl,
            DisplayOrder = req.DisplayOrder,
            IsActive = req.IsActive
        };

        var result = await _service.CreateDirectAsync(member);
        return Ok(result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> Update(int id, [FromForm] CreateTeamRequest req)
    {
        var success = await _service.UpdateDirectAsync(id, req.Name, req.Designation,
            req.FacebookUrl, req.LinkedInUrl, req.DisplayOrder, req.IsActive,
            req.Photo, _cloudinary);
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