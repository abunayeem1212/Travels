import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '../components/common/Layout';
import InquiryModal from '../components/common/InquiryModal';
import PlaceholderImage from '../components/common/PlaceholderImage';
import { HotelDetail } from '../types';
import { hotelApi } from '../api/services';

export default function HotelDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [hotel, setHotel] = useState<HotelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showInquiry, setShowInquiry] = useState(false);

  useEffect(() => {
    if (!slug) return;
    hotelApi.getBySlug(slug)
      .then(res => setHotel(res.data))
      .catch(() => setHotel(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-96 bg-gray-200 rounded-2xl animate-pulse mb-6" />
        <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2 mb-4" />
      </div>
    </Layout>
  );

  if (!hotel) return (
    <Layout>
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold text-gray-700">Hotel not found</h2>
        <Link to="/" className="text-blue-600 mt-4 inline-block">
          ← Back to Home
        </Link>
      </div>
    </Layout>
  );

  const images = hotel.images || [];

  // =========================
  // ✅ SAFE AMENITIES PARSER
  // =========================
  let amenities: string[] = [];

  try {
    if (hotel.amenities) {
      const parsed = JSON.parse(hotel.amenities);

      if (Array.isArray(parsed)) {
        amenities = parsed;
      } else {
        amenities = String(hotel.amenities)
          .split(',')
          .map(item => item.trim())
          .filter(Boolean);
      }
    }
  } catch {
    amenities = typeof hotel.amenities === 'string'
      ? hotel.amenities.split(',').map(s => s.trim()).filter(Boolean)
      : [];
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/#hotels" className="hover:text-blue-600">Hotels</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{hotel.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left */}
          <div className="lg:col-span-2 space-y-6">

            {/* Images */}
            {images.length > 0 && (
              <div>
                <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden">
                  <PlaceholderImage
                    src={images[activeImage]?.imageUrl}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImage(p =>
                          (p - 1 + images.length) % images.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2
                          w-9 h-9 bg-black/40 hover:bg-black/60 text-white
                          rounded-full flex items-center justify-center"
                      >
                        <ChevronLeft size={18} />
                      </button>

                      <button
                        onClick={() => setActiveImage(p =>
                          (p + 1) % images.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2
                          w-9 h-9 bg-black/40 hover:bg-black/60 text-white
                          rounded-full flex items-center justify-center"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                    {images.map((img, i) => (
                      <button
                        key={img.id}
                        onClick={() => setActiveImage(i)}
                        className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden
                          ring-2 transition
                          ${i === activeImage ? 'ring-blue-500' : 'ring-transparent'}`}
                      >
                        <PlaceholderImage
                          src={img.imageUrl}
                          alt={`Thumbnail ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Info */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {hotel.name}
                </h1>

                <div className="flex items-center gap-1">
                  {Array.from({ length: hotel.starRating }).map((_, i) => (
                    <Star key={i} size={18}
                      className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                <MapPin size={15} className="text-blue-500" />
                {hotel.location}
              </div>

              <p className="text-gray-600 leading-relaxed">
                {hotel.description}
              </p>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="bg-blue-50 rounded-2xl p-5">
                <h3 className="font-bold text-gray-800 mb-4">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((item, i) => (
                    <span
                      key={i}
                      className="bg-white border border-blue-100 text-blue-700
                        text-sm px-3 py-1.5 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right */}
          <div>
            <div className="sticky top-24 bg-white rounded-2xl shadow-lg
              border border-gray-100 p-6">

              <div className="mb-6">
                <div className="text-3xl font-bold text-blue-600">
                  ৳{hotel.pricePerNight.toLocaleString()}
                </div>
                <span className="text-gray-400 text-sm">per night</span>
              </div>

              <div className="space-y-2 text-sm mb-6">
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Location</span>
                  <span className="font-medium">{hotel.location}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Star Rating</span>
                  <div className="flex">
                    {Array.from({ length: hotel.starRating }).map((_, i) => (
                      <Star key={i} size={14}
                        className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowInquiry(true)}
                className="w-full bg-blue-600 text-white font-semibold py-3
                  rounded-xl hover:bg-blue-700 transition"
              >
                Book Now / Inquiry
              </button>

            </div>
          </div>
        </div>
      </div>

      {showInquiry && (
        <InquiryModal
          hotelId={hotel.id}
          title={hotel.name}
          onClose={() => setShowInquiry(false)}
        />
      )}
    </Layout>
  );
}