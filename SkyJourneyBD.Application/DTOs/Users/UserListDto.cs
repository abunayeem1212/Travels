using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkyJourneyBD.Application.DTOs.Users;

public class UserListDto
{
    public string Id { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string Role { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class UpdateUserRoleDto
{
    public string UserId { get; set; } = string.Empty;
    public string NewRole { get; set; } = string.Empty;
}

public class UpdateUserStatusDto
{
    public string UserId { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
