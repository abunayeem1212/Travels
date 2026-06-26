import api from './axios';
import {
  Package, PackageDetail, Hotel, HotelDetail,
  Banner, GalleryItem, TeamMember, Testimonial,
  AuthResponse, DashboardStats, Inquiry, ContactMessage,
  AirTicket,
  AirTicketDetail,
  User
} from '../types';

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),
  register: (data: any) =>
    api.post<AuthResponse>('/auth/register', data),
};

// Packages
export const packageApi = {
  getAll: (popular?: boolean) =>
    api.get<Package[]>('/packages', { params: popular ? { popular } : {} }),
  getBySlug: (slug: string) =>
    api.get<PackageDetail>(`/packages/${slug}`),
  getAdminList: () =>
    api.get<Package[]>('/packages/admin/all'),
  create: (data: any) =>
    api.post('/packages', data),
  update: (id: number, data: any) =>
    api.put(`/packages/${id}`, data),
  delete: (id: number) =>
    api.delete(`/packages/${id}`),
  uploadImages: (id: number, files: File[]) => {
    const form = new FormData();
    files.forEach(f => form.append('images', f));
    return api.post(`/packages/${id}/images`, form);
  },
};

// Hotels
export const hotelApi = {
  getAll: (location?: string, stars?: number) =>
    api.get<Hotel[]>('/hotels', { params: { location, stars } }),
  getBySlug: (slug: string) =>
    api.get<HotelDetail>(`/hotels/${slug}`),
  getAdminList: () =>
    api.get<Hotel[]>('/hotels/admin/all'),
  create: (data: any) =>
    api.post('/hotels', data),
  update: (id: number, data: any) =>
    api.put(`/hotels/${id}`, data),
  delete: (id: number) =>
    api.delete(`/hotels/${id}`),
  uploadImages: (id: number, files: File[]) => {
    const form = new FormData();
    files.forEach(f => form.append('images', f));
    return api.post(`/hotels/${id}/images`, form);
  },
};

// Common
export const commonApi = {
  getBanners: () => api.get<Banner[]>('/banners'),
  getGallery: (category?: string, type?: string) =>
    api.get<GalleryItem[]>('/gallery', { params: { category, type } }),
  getTeam: () => api.get<TeamMember[]>('/team'),
  getTestimonials: () => api.get<Testimonial[]>('/testimonials'),
  submitContact: (data: any) => api.post('/contact', data),
  submitInquiry: (data: any) => api.post('/inquiries', data),
};

// Admin
export const adminApi = {
  getDashboard: () => api.get<DashboardStats>('/admin/dashboard'),
  getInquiries: (status?: string) =>
    api.get<Inquiry[]>('/inquiries', { params: { status } }),
  updateInquiryStatus: (id: number, status: number) =>
  api.patch(`/inquiries/${id}/status`, JSON.stringify(status), {
    headers: { 'Content-Type': 'application/json' }
  }),
  getMessages: (unreadOnly?: boolean) =>
    api.get<ContactMessage[]>('/contact', { params: { unreadOnly } }),
  replyMessage: (id: number, reply: string) =>
    api.post(`/contact/${id}/reply`, JSON.stringify(reply), {
      headers: { 'Content-Type': 'application/json' }
    }),
  markMessageRead: (id: number) =>
    api.patch(`/contact/${id}/read`),
};

export const airTicketApi = {
  getAll: (popular?: boolean) =>
    api.get<AirTicket[]>('/airtickets', { params: popular ? { popular } : {} }),
  getById: (id: number) =>
    api.get<AirTicketDetail>(`/airtickets/${id}`),
  getAdminList: () =>
    api.get<AirTicket[]>('/airtickets/admin/all'),
  create: (data: any) => api.post('/airtickets', data),
  update: (id: number, data: any) => api.put(`/airtickets/${id}`, data),
  delete: (id: number) => api.delete(`/airtickets/${id}`),
  uploadLogo: (id: number, file: File) => {
    const form = new FormData();
    form.append('logo', file);
    return api.post(`/airtickets/${id}/logo`, form);
  },
};

export const userApi = {
  getAll: () => api.get<User[]>('/users'),
  updateRole: (userId: string, newRole: string) =>
    api.put('/users/role', { userId, newRole }),
  updateStatus: (userId: string, isActive: boolean) =>
    api.put('/users/status', { userId, isActive }),
  delete: (id: string) => api.delete(`/users/${id}`),
  create: (data: any) => api.post('/users/create', data),
};