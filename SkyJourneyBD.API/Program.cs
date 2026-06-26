using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SkyJourneyBD.API.Services;
using SkyJourneyBD.Domain.Entities;
using SkyJourneyBD.Infrastructure.Data;
using SkyJourneyBD.Infrastructure.Identity;
using SkyJourneyBD.Infrastructure.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:SecretKey"]!;
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

builder.Services.AddAuthorization();

// CORS — Angular dev server এর জন্য
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins(
            "http://localhost:3000",
            "http://localhost:4200",
            "https://the-friendship-tours-travels.vercel.app"
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Services register
builder.Services.AddScoped<JwtTokenService>();
builder.Services.AddScoped<PackageService>();
builder.Services.AddScoped<HotelService>();
builder.Services.AddScoped<ContactService>();
builder.Services.AddScoped<InquiryService>();
builder.Services.AddScoped<BannerService>();
builder.Services.AddScoped<GalleryService>();
builder.Services.AddScoped<TeamService>();
builder.Services.AddScoped<TestimonialService>();
builder.Services.AddScoped<DashboardService>();
builder.Services.AddScoped<CloudinaryService>();
builder.Services.AddScoped<AirTicketService>();

// Swagger with JWT support
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "SkyJourneyBD API", Version = "v1" });

    //c.OperationFilter<FileUploadOperationFilter>();
    c.MapType<IFormFile>(() => new OpenApiSchema { Type = "string", Format = "binary" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Enter: Bearer {token}",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement {
        { new OpenApiSecurityScheme {
            Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
        }, Array.Empty<string>() }
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// First migration & seed Admin user
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

    // Roles তৈরি করো
    // Roles seed
    foreach (var role in new[] {
    "SuperAdmin", "Admin", "Moderator", "Agent", "User"
})
    {
        if (!await roleManager.RoleExistsAsync(role))
            await roleManager.CreateAsync(new IdentityRole(role));
    }

    // SuperAdmin seed
    if (await userManager.FindByEmailAsync("superadmin@skyjourneybd.com") == null)
    {
        var superAdmin = new ApplicationUser
        {
            FullName = "Super Admin",
            UserName = "superadmin@skyjourneybd.com",
            Email = "superadmin@skyjourneybd.com",
            IsActive = true
        };
        await userManager.CreateAsync(superAdmin, "SuperAdmin@12345");
        await userManager.AddToRoleAsync(superAdmin, "SuperAdmin");
    }

    // Admin seed
    if (await userManager.FindByEmailAsync("admin@skyjourneybd.com") == null)
    {
        var admin = new ApplicationUser
        {
            FullName = "Admin User",
            UserName = "admin@skyjourneybd.com",
            Email = "admin@skyjourneybd.com",
            IsActive = true
        };
        await userManager.CreateAsync(admin, "Admin@12345");
        await userManager.AddToRoleAsync(admin, "Admin");
    }
}

app.Run();