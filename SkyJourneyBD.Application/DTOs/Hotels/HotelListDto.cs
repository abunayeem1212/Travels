using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkyJourneyBD.Application.DTOs.Hotels;

public class HotelListDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public int StarRating { get; set; }
    public decimal PricePerNight { get; set; }
    public string? CoverImage { get; set; }
}

public class HotelDetailDto : HotelListDto
{
    public string Description { get; set; } = string.Empty;
    public string? Amenities { get; set; }
    public List<HotelImageDto> Images { get; set; } = new();
}

public class HotelImageDto
{
    public int Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsCover { get; set; }
}

public class CreateHotelDto
{
    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public int StarRating { get; set; }
    public decimal PricePerNight { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? Amenities { get; set; }
    public bool IsActive { get; set; } = true;
}
