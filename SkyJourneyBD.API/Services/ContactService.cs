using Microsoft.EntityFrameworkCore;
using SkyJourneyBD.Application.DTOs.Contact;
using SkyJourneyBD.Domain.Entities;
using SkyJourneyBD.Infrastructure.Data;

namespace SkyJourneyBD.API.Services;

public class ContactService
{
    private readonly AppDbContext _db;

    public ContactService(AppDbContext db) => _db = db;

    public async Task SubmitAsync(SubmitContactDto dto)
    {
        var message = new ContactMessage
        {
            Name = dto.Name,
            Phone = dto.Phone,
            Email = dto.Email,
            Subject = dto.Subject,
            Message = dto.Message
        };

        _db.ContactMessages.Add(message);
        await _db.SaveChangesAsync();
    }

    public async Task<List<ContactMessage>> GetAllAsync(bool? unreadOnly = null)
    {
        var query = _db.ContactMessages.AsQueryable();

        if (unreadOnly == true)
            query = query.Where(m => !m.IsRead);

        return await query
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync();
    }

    public async Task<bool> ReplyAsync(int id, string replyText)
    {
        var message = await _db.ContactMessages.FindAsync(id);
        if (message == null) return false;

        message.AdminReply = replyText;
        message.RepliedAt = DateTime.UtcNow;
        message.IsRead = true;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> MarkReadAsync(int id)
    {
        var message = await _db.ContactMessages.FindAsync(id);
        if (message == null) return false;

        message.IsRead = true;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var message = await _db.ContactMessages.FindAsync(id);
        if (message == null) return false;

        _db.ContactMessages.Remove(message);
        await _db.SaveChangesAsync();
        return true;
    }
}