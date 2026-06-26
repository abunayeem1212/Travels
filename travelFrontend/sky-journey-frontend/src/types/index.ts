export interface Package {
  id: number;
  title: string;
  slug: string;
  location: string;
  price: number;
  discountPrice?: number;
  duration: string;
  isPopular: boolean;
  coverImage?: string;
}

export interface PackageDetail extends Package {
  description: string;
  includes?: string;
  itinerary?: string;
  images: PackageImage[];
}

export interface PackageImage {
  id: number;
  imageUrl: string;
  isCover: boolean;
  displayOrder: number;
}

export interface Hotel {
  id: number;
  name: string;
  slug: string;
  location: string;
  starRating: number;
  pricePerNight: number;
  coverImage?: string;
}

export interface HotelDetail extends Hotel {
  description: string;
  amenities?: string;
  images: { id: number; imageUrl: string; isCover: boolean }[];
}

export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
}

export interface GalleryItem {
   id: number;
  title: string;
  mediaUrl: string;
  mediaType: string;  // "Photo" | "Video"
  category?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface VideoSection {
  id: number;
  title: string;
  videoUrl: string;
  thumbnail?: string;
  category?: string;
}

export interface TeamMember {
  id: number;
  name: string;
  designation: string;
  photoUrl?: string;
  facebookUrl?: string;
  linkedInUrl?: string;
}

export interface Testimonial {
  id: number;
  customerName: string;
  location?: string;
  reviewText: string;
  rating: number;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  fullName: string;
  email: string;
  role: string;
}

export interface DashboardStats {
  totalPackages: number;
  totalHotels: number;
  totalInquiries: number;
  pendingInquiries: number;
  totalMessages: number;
  unreadMessages: number;
  recentInquiries: RecentInquiry[];
  recentMessages: RecentMessage[];
}

export interface RecentInquiry {
  id: number;
  name: string;
  phone: string;
  status: string;
  packageOrHotel?: string;
  createdAt: string;
}

export interface RecentMessage {
  id: number;
  name: string;
  subject: string;
  isRead: boolean;
  createdAt: string;
}

export interface Inquiry {
  id: number;
  name: string;
  phone: string;
  email: string;
  travelDate?: string;
  adults: number;
  children: number;
  message?: string;
  status: string;
  createdAt: string;
  packageTitle?: string;
  hotelName?: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  adminReply?: string;
  createdAt: string;
}

export interface AirTicket {
  id: number;

  airlineName: string;
  fromCity: string;
  toCity: string;
  tripType: string;
  flightClass: string;

  airlineNameBn: string;
  fromCityBn: string;
  toCityBn: string;
  tripTypeBn: string;
  flightClassBn: string;

  checkedBaggageKg: number;
  cabinBaggageKg: number;

  price: number;
  discountPrice?: number;
  airlineLogoUrl?: string;
  isPopular: boolean;
}

export interface AirTicketDetail extends AirTicket {
  description?: string;
  descriptionBn?: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export type UserRole =
  'SuperAdmin' | 'Admin' | 'Moderator' | 'Agent' | 'User';

export interface RolePermissions {
  canDelete: boolean;
  canManageUsers: boolean;
  canManageSettings: boolean;
  canManageBanners: boolean;
  canManageTeam: boolean;
  isSuperAdmin: boolean;
}