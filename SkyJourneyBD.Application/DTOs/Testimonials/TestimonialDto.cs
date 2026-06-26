using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkyJourneyBD.Application.DTOs.Testimonials;

public class TestimonialDto
{
    public int Id { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string ReviewText { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string? AvatarUrl { get; set; }
}

public class CreateTestimonialDto
{
    public string CustomerName { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string ReviewText { get; set; } = string.Empty;
    public int Rating { get; set; } = 5;
    public bool IsActive { get; set; } = true;
}
