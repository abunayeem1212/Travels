import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PackageDetailPage from './pages/PackageDetailPage';
import HotelDetailPage from './pages/HotelDetailPage';
import GalleryPage from './pages/GalleryPage';
import SearchPage from './pages/SearchPage';
import AdminDashboard from './pages/admin/DashboardPage';
import AdminPackages from './pages/admin/PackagesPage';
import AdminHotels from './pages/admin/HotelsPage';
import AdminBanners from './pages/admin/BannersPage';
import AdminTeam from './pages/admin/TeamPage';
import AdminTestimonials from './pages/admin/TestimonialsPage';
import AdminMessages from './pages/admin/MessagesPage';
import AdminInquiries from './pages/admin/InquiriesPage';
import AdminGalleryPage from './pages/admin/GalleryPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminAirTicketsPage from './pages/admin/AirTicketsPage';
import RegisterPage from './pages/RegisterPage';
import AdminUsersPage from './pages/admin/UsersPage';

// Protected Route
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdminOrAgent } = useAuth();
  return isAdminOrAgent() ? <>{children}</> : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/packages/:slug" element={<PackageDetailPage />} />
      <Route path="/hotels/:slug" element={<HotelDetailPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/login" element={<LoginPage />} />
    
    <Route path="/register" element={<RegisterPage />} />


      {/* Admin */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/admin/packages" element={
        <ProtectedRoute><AdminPackages /></ProtectedRoute>
      } />
      <Route path="/admin/hotels" element={
        <ProtectedRoute><AdminHotels /></ProtectedRoute>
      } />
      <Route path="/admin/banners" element={
        <ProtectedRoute><AdminBanners /></ProtectedRoute>
      } />
      <Route path="/admin/gallery" element={
        <ProtectedRoute><AdminGalleryPage /></ProtectedRoute>
      } />
      <Route path="/admin/team" element={
        <ProtectedRoute><AdminTeam /></ProtectedRoute>
      } />
      <Route path="/admin/testimonials" element={
        <ProtectedRoute><AdminTestimonials /></ProtectedRoute>
      } />
      <Route path="/admin/messages" element={
        <ProtectedRoute><AdminMessages /></ProtectedRoute>
      } />
      <Route path="/admin/inquiries" element={
        <ProtectedRoute><AdminInquiries /></ProtectedRoute>
      } />



      <Route
  path="/admin/air-tickets"
  element={
    <ProtectedRoute>
      <AdminAirTicketsPage />
    </ProtectedRoute>
  }
/>


<Route
  path="/admin/users"
  element={
    <ProtectedRoute>
      <AdminUsersPage />
    </ProtectedRoute>
  }
/>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Toaster position="top-right" />
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;