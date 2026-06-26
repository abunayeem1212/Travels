using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkyJourneyBD.Application.DTOs.Team;

public class TeamMemberDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public string? PhotoUrl { get; set; }
    public string? FacebookUrl { get; set; }
    public string? LinkedInUrl { get; set; }
    public int DisplayOrder { get; set; }
}

public class CreateTeamMemberDto
{
    public string Name { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public string? FacebookUrl { get; set; }
    public string? LinkedInUrl { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
