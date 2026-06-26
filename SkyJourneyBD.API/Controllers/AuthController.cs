using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SkyJourneyBD.Application.DTOs.Auth;
using SkyJourneyBD.Domain.Entities;
using SkyJourneyBD.Infrastructure.Identity;

namespace SkyJourneyBD.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly JwtTokenService _jwtService;

    public AuthController(UserManager<ApplicationUser> userManager, JwtTokenService jwtService)
    {
        _userManager = userManager;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        if (await _userManager.FindByEmailAsync(dto.Email) != null)
            return BadRequest(new { message = "Email already exists." });

        var user = new ApplicationUser
        {
            FullName = dto.FullName,
            Email = dto.Email,
            UserName = dto.Email,
            Phone = dto.Phone
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        await _userManager.AddToRoleAsync(user, "User");

        var token = await _jwtService.GenerateTokenAsync(user);
        return Ok(new AuthResponseDto
        {
            Token = token,
            FullName = user.FullName,
            Email = user.Email!,
            Role = "User",
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null || !user.IsActive)
            return Unauthorized(new { message = "Invalid credentials." });

        var validPassword = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!validPassword)
            return Unauthorized(new { message = "Invalid credentials." });

        var roles = await _userManager.GetRolesAsync(user);
        var token = await _jwtService.GenerateTokenAsync(user);

        return Ok(new AuthResponseDto
        {
            Token = token,
            FullName = user.FullName,
            Email = user.Email!,
            Role = roles.FirstOrDefault() ?? "User",
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        });
    }
}