using Microsoft.EntityFrameworkCore;
using SkyJourneyBD.Application.DTOs.Team;
using SkyJourneyBD.Domain.Entities;
using SkyJourneyBD.Infrastructure.Data;
using SkyJourneyBD.Infrastructure.Services;

namespace SkyJourneyBD.API.Services;

public class TeamService
{
    private readonly AppDbContext _db;

    public TeamService(AppDbContext db) => _db = db;

    public async Task<List<TeamMemberDto>> GetAllAsync()
    {
        return await _db.TeamMembers
            .Where(t => t.IsActive)
            .OrderBy(t => t.DisplayOrder)
            .Select(t => new TeamMemberDto
            {
                Id = t.Id,
                Name = t.Name,
                Designation = t.Designation,
                PhotoUrl = t.PhotoUrl,
                FacebookUrl = t.FacebookUrl,
                LinkedInUrl = t.LinkedInUrl,
                DisplayOrder = t.DisplayOrder
            }).ToListAsync();
    }

    public async Task<TeamMember> CreateAsync(
        CreateTeamMemberDto dto, IFormFile? photo, CloudinaryService cloudinary)
    {
        string? photoUrl = null;
        string? publicId = null;

        if (photo != null)
        {
            (photoUrl, publicId) = await cloudinary.UploadImageAsync(
                photo.OpenReadStream(), photo.FileName, "skyjourneybd/team");
        }

        var member = new TeamMember
        {
            Name = dto.Name,
            Designation = dto.Designation,
            PhotoUrl = photoUrl,
            PublicId = publicId,
            FacebookUrl = dto.FacebookUrl,
            LinkedInUrl = dto.LinkedInUrl,
            DisplayOrder = dto.DisplayOrder,
            IsActive = dto.IsActive
        };

        _db.TeamMembers.Add(member);
        await _db.SaveChangesAsync();
        return member;
    }

    public async Task<bool> UpdateAsync(
        int id, CreateTeamMemberDto dto, IFormFile? photo, CloudinaryService cloudinary)
    {
        var member = await _db.TeamMembers.FindAsync(id);
        if (member == null) return false;

        if (photo != null)
        {
            if (!string.IsNullOrEmpty(member.PublicId))
                await cloudinary.DeleteImageAsync(member.PublicId);

            (member.PhotoUrl, member.PublicId) = await cloudinary.UploadImageAsync(
                photo.OpenReadStream(), photo.FileName, "skyjourneybd/team");
        }

        member.Name = dto.Name;
        member.Designation = dto.Designation;
        member.FacebookUrl = dto.FacebookUrl;
        member.LinkedInUrl = dto.LinkedInUrl;
        member.DisplayOrder = dto.DisplayOrder;
        member.IsActive = dto.IsActive;
        member.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id, CloudinaryService cloudinary)
    {
        var member = await _db.TeamMembers.FindAsync(id);
        if (member == null) return false;

        if (!string.IsNullOrEmpty(member.PublicId))
            await cloudinary.DeleteImageAsync(member.PublicId);

        _db.TeamMembers.Remove(member);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<TeamMember> CreateDirectAsync(TeamMember member)
    {
        _db.TeamMembers.Add(member);
        await _db.SaveChangesAsync();
        return member;
    }

    public async Task<bool> UpdateDirectAsync(
        int id, string name, string designation,
        string? facebookUrl, string? linkedInUrl,
        int displayOrder, bool isActive,
        IFormFile? photo, CloudinaryService cloudinary)
    {
        var member = await _db.TeamMembers.FindAsync(id);
        if (member == null) return false;

        if (photo != null)
        {
            if (!string.IsNullOrEmpty(member.PublicId))
                await cloudinary.DeleteImageAsync(member.PublicId);

            (member.PhotoUrl, member.PublicId) = await cloudinary.UploadImageAsync(
                photo.OpenReadStream(), photo.FileName, "skyjourneybd/team");
        }

        member.Name = name;
        member.Designation = designation;
        member.FacebookUrl = facebookUrl;
        member.LinkedInUrl = linkedInUrl;
        member.DisplayOrder = displayOrder;
        member.IsActive = isActive;
        member.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return true;
    }
}