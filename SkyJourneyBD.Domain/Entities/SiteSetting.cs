using SkyJourneyBD.Domain.Common;

namespace SkyJourneyBD.Domain.Entities;

public class SiteSetting : BaseEntity
{
    public string Key { get; set; } = string.Empty;    // "site_phone", "facebook_url"
    public string Value { get; set; } = string.Empty;  // actual value
    public string? Description { get; set; }           // admin panel এ hint দেখাবে
}