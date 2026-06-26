using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkyJourneyBD.API.Services;

namespace SkyJourneyBD.API.Controllers;

[ApiController]
[Route("api/admin/dashboard")]
[Authorize(Roles = "SuperAdmin,Admin,Agent")]
public class DashboardController : ControllerBase
{
    private readonly DashboardService _service;

    public DashboardController(DashboardService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetStats()
        => Ok(await _service.GetStatsAsync());
}