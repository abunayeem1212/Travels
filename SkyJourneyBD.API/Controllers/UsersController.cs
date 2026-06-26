using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SkyJourneyBD.Application.DTOs.Users;
using SkyJourneyBD.Domain.Entities;

namespace SkyJourneyBD.API.Controllers;

[ApiController]
[Route("api/users")]
[Authorize(Roles = "SuperAdmin,Admin")]
public class UsersController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UsersController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userManager.Users.ToListAsync();
        var result = new List<UserListDto>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            result.Add(new UserListDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email!,
                Phone = user.Phone,
                Role = roles.FirstOrDefault() ?? "User",
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt
            });
        }

        return Ok(result.OrderByDescending(u => u.CreatedAt));
    }

    [HttpPut("role")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> UpdateRole(UpdateUserRoleDto dto)
    {
        var user = await _userManager.FindByIdAsync(dto.UserId);
        if (user == null) return NotFound();

        // SuperAdmin role শুধু SuperAdmin দিতে পারবে
        if (dto.NewRole == "SuperAdmin" &&
            !User.IsInRole("SuperAdmin"))
            return Forbid();

        var currentRoles = await _userManager.GetRolesAsync(user);
        await _userManager.RemoveFromRolesAsync(user, currentRoles);
        await _userManager.AddToRoleAsync(user, dto.NewRole);

        return Ok(new { message = "Role updated successfully" });
    }

    [HttpPut("status")]
    public async Task<IActionResult> UpdateStatus(UpdateUserStatusDto dto)
    {
        var user = await _userManager.FindByIdAsync(dto.UserId);
        if (user == null) return NotFound();

        user.IsActive = dto.IsActive;
        await _userManager.UpdateAsync(user);

        return Ok(new { message = "Status updated" });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> Delete(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound();

        // SuperAdmin delete করা যাবে না
        if (await _userManager.IsInRoleAsync(user, "SuperAdmin"))
            return BadRequest(new { message = "Cannot delete SuperAdmin" });

        await _userManager.DeleteAsync(user);
        return NoContent();
    }

    [HttpPost("create")]
    [Authorize(Roles = "SuperAdmin,Admin")]
    public async Task<IActionResult> CreateUser(
        [FromBody] CreateUserByAdminDto dto)
    {
        if (await _userManager.FindByEmailAsync(dto.Email) != null)
            return BadRequest(new { message = "Email already exists" });

        var user = new ApplicationUser
        {
            FullName = dto.FullName,
            Email = dto.Email,
            UserName = dto.Email,
            Phone = dto.Phone,
            IsActive = true
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        await _userManager.AddToRoleAsync(user, dto.Role);
        return Ok(new { message = "User created successfully" });
    }
}