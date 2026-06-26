using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SkyJourneyBD.Domain.Entities;

namespace SkyJourneyBD.Infrastructure.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<TourPackage> TourPackages => Set<TourPackage>();
    public DbSet<PackageImage> PackageImages => Set<PackageImage>();
    public DbSet<Hotel> Hotels => Set<Hotel>();
    public DbSet<HotelImage> HotelImages => Set<HotelImage>();
    public DbSet<BookingInquiry> BookingInquiries => Set<BookingInquiry>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<Banner> Banners => Set<Banner>();
    public DbSet<Gallery> Galleries => Set<Gallery>();
    public DbSet<TeamMember> TeamMembers => Set<TeamMember>();
    public DbSet<Testimonial> Testimonials => Set<Testimonial>();
    
    public DbSet<AirTicketPackage> AirTicketPackages => Set<AirTicketPackage>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Decimal precision
        builder.Entity<TourPackage>()
            .Property(p => p.Price).HasPrecision(18, 2);

        builder.Entity<TourPackage>()
       .Property(p => p.DiscountPrice).HasPrecision(18, 2);

        builder.Entity<Hotel>()
            .Property(h => h.PricePerNight).HasPrecision(18, 2);


        // OnModelCreating এ
        builder.Entity<AirTicketPackage>()
            .Property(a => a.Price).HasPrecision(18, 2);
        builder.Entity<AirTicketPackage>()
            .Property(a => a.DiscountPrice).HasPrecision(18, 2);
    }
}