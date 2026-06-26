using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkyJourneyBD.Domain.Constants;

public static class RolePermissions
{
    // SuperAdmin — সব কিছু
    // Admin — Settings ছাড়া সব
    // Moderator — Content manage, delete নেই
    // Agent — Package/Hotel/Inquiry শুধু
    // User — Public only

    public static readonly string[] CanViewDashboard =
        { "SuperAdmin", "Admin", "Moderator", "Agent" };

    public static readonly string[] CanManagePackages =
        { "SuperAdmin", "Admin", "Moderator", "Agent" };

    public static readonly string[] CanDeletePackages =
        { "SuperAdmin", "Admin" };

    public static readonly string[] CanManageHotels =
        { "SuperAdmin", "Admin", "Moderator", "Agent" };

    public static readonly string[] CanDeleteHotels =
        { "SuperAdmin", "Admin" };

    public static readonly string[] CanManageGallery =
        { "SuperAdmin", "Admin", "Moderator" };

    public static readonly string[] CanDeleteGallery =
        { "SuperAdmin", "Admin" };

    public static readonly string[] CanManageBanners =
        { "SuperAdmin", "Admin" };

    public static readonly string[] CanManageTeam =
        { "SuperAdmin", "Admin" };

    public static readonly string[] CanManageTestimonials =
        { "SuperAdmin", "Admin", "Moderator" };

    public static readonly string[] CanViewInquiries =
        { "SuperAdmin", "Admin", "Moderator", "Agent" };

    public static readonly string[] CanViewMessages =
        { "SuperAdmin", "Admin", "Moderator" };

    public static readonly string[] CanReplyMessages =
        { "SuperAdmin", "Admin", "Moderator" };

    public static readonly string[] CanManageUsers =
        { "SuperAdmin", "Admin" };

    public static readonly string[] CanManageRoles =
        { "SuperAdmin" };

    public static readonly string[] CanManageSettings =
        { "SuperAdmin" };
}
