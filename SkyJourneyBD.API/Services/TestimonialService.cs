using Microsoft.EntityFrameworkCore;
using SkyJourneyBD.Application.DTOs.Testimonials;
using SkyJourneyBD.Domain.Entities;
using SkyJourneyBD.Infrastructure.Data;

namespace SkyJourneyBD.API.Services;

public class TestimonialService
{
    private readonly AppDbContext _db;

    public TestimonialService(AppDbContext db) => _db = db;

    public async Task<List<TestimonialDto>> GetActiveAsync()
    {
        return await _db.Testimonials
            .Where(t => t.IsActive)
            .Select(t => new TestimonialDto
            {
                Id = t.Id,
                CustomerName = t.CustomerName,
                Location = t.Location,
                ReviewText = t.ReviewText,
                Rating = t.Rating,
                AvatarUrl = t.AvatarUrl
            }).ToListAsync();
    }

    public async Task<Testimonial> CreateAsync(CreateTestimonialDto dto)
    {
        var testimonial = new Testimonial
        {
            CustomerName = dto.CustomerName,
            Location = dto.Location,
            ReviewText = dto.ReviewText,
            Rating = dto.Rating,
            IsActive = dto.IsActive
        };

        _db.Testimonials.Add(testimonial);
        await _db.SaveChangesAsync();
        return testimonial;
    }

    public async Task<bool> UpdateAsync(int id, CreateTestimonialDto dto)
    {
        var testimonial = await _db.Testimonials.FindAsync(id);
        if (testimonial == null) return false;

        testimonial.CustomerName = dto.CustomerName;
        testimonial.Location = dto.Location;
        testimonial.ReviewText = dto.ReviewText;
        testimonial.Rating = dto.Rating;
        testimonial.IsActive = dto.IsActive;
        testimonial.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var t = await _db.Testimonials.FindAsync(id);
        if (t == null) return false;

        _db.Testimonials.Remove(t);
        await _db.SaveChangesAsync();
        return true;
    }
}