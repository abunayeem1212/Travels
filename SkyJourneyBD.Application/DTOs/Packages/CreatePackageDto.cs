using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkyJourneyBD.Application.DTOs.Packages;

public class CreatePackageDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public string Duration { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string? Includes { get; set; }
    public string? Itinerary { get; set; }
    public bool IsPopular { get; set; }
    public bool IsActive { get; set; } = true;
}
