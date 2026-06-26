import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import Layout from '../components/common/Layout';
import InquiryModal from '../components/common/InquiryModal';
import PlaceholderImage from '../components/common/PlaceholderImage';
import { PackageDetail } from '../types';
import { packageApi } from '../api/services';

export default function PackageDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [pkg, setPkg] = useState<PackageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showInquiry, setShowInquiry] = useState(false);

  useEffect(() => {
    if (!slug) return;
    packageApi.getBySlug(slug)
      .then(res => setPkg(res.data))
      .catch(() => setPkg(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-96 bg-gray-200 rounded-2xl animate-pulse mb-6" />
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-4 w-1/2" />
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
      </div>
    </Layout>
  );

  if (!pkg) return (
    <Layout>
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold text-gray-700">Package not found</h2>
        <Link to="/" className="text-blue-600 mt-4 inline-block">
          ← Back to Home
        </Link>
      </div>
    </Layout>
  );

  const images = pkg.images.length > 0 ? pkg.images : [];
  const safeParseJSON = (value: string | null | undefined, fallback: any) => {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return parsed;
  } catch {
    // Already plain text হলে array এ wrap করো
    return typeof value === 'string' ? [value] : fallback;
  }
};

const includes = safeParseJSON(pkg.includes, []);
const itinerary = safeParseJSON(pkg.itinerary, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/#packages" className="hover:text-blue-600">Packages</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{pkg.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Images + Details */}
          <div className="lg:col-span-2 space-y-6">

            {/* Image Gallery */}
            {images.length > 0 && (
              <div>
                <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden">
                  <PlaceholderImage
                    src={images[activeImage]?.imageUrl}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImage(p =>
                          (p - 1 + images.length) % images.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2
                          w-9 h-9 bg-black/40 hover:bg-black/60 text-white
                          rounded-full flex items-center justify-center">
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={() => setActiveImage(p =>
                          (p + 1) % images.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2
                          w-9 h-9 bg-black/40 hover:bg-black/60 text-white
                          rounded-full flex items-center justify-center">
                        <ChevronRight size={18} />
                      </button>
                    </>
                  )}
                </div>
                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                    {images.map((img, i) => (
                      <button key={img.id} onClick={() => setActiveImage(i)}
                        className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden
                          ring-2 transition
                          ${i === activeImage
                            ? 'ring-blue-500' : 'ring-transparent'}`}>
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

            {/* Title & Info */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                {pkg.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <MapPin size={15} className="text-blue-500" />
                  {pkg.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={15} className="text-blue-500" />
                  {pkg.duration}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">{pkg.description}</p>
            </div>

            {/* Includes */}
            {includes.length > 0 && (
              <div className="bg-green-50 rounded-2xl p-5">
                <h3 className="font-bold text-gray-800 mb-4">What's Included</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {includes.map((item: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Check size={16} className="text-green-500 shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary */}
            {itinerary.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-800 mb-4 text-xl">
                  Day-by-Day Itinerary
                </h3>
                <div className="space-y-4">
                  {itinerary.map((day: any, i: number) => (
                    <div key={i}
                      className="border border-gray-100 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-8 h-8 bg-blue-600 text-white
                          rounded-full flex items-center justify-center
                          text-sm font-bold shrink-0">
                          {i + 1}
                        </span>
                        <h4 className="font-semibold text-gray-800">
                          {day.title || `Day ${i + 1}`}
                        </h4>
                      </div>
                      <p className="text-gray-600 text-sm pl-11">
                        {day.description || day}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-lg
              border border-gray-100 p-6">
              <div className="mb-4">
                {pkg.discountPrice ? (
                  <div>
                    <span className="text-gray-400 line-through text-sm">
                      ৳{pkg.price.toLocaleString()}
                    </span>
                    <div className="text-3xl font-bold text-blue-600">
                      ৳{pkg.discountPrice.toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-blue-600">
                    ৳{pkg.price.toLocaleString()}
                  </div>
                )}
                <span className="text-gray-400 text-sm">per person</span>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-6">
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium">{pkg.duration}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Location</span>
                  <span className="font-medium">{pkg.location}</span>
                </div>
                {pkg.isPopular && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Status</span>
                    <span className="text-orange-500 font-medium">
                      ⭐ Popular
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowInquiry(true)}
                className="w-full bg-blue-600 text-white font-semibold py-3
                  rounded-xl hover:bg-blue-700 transition text-center block">
                Book Now / Inquiry
              </button>

              <a href="#contact"
                className="w-full mt-3 border border-blue-200 text-blue-600
                  font-medium py-3 rounded-xl hover:bg-blue-50 transition
                  text-center block text-sm">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {showInquiry && (
        <InquiryModal
          packageId={pkg.id}
          title={pkg.title}
          onClose={() => setShowInquiry(false)}
        />
      )}
    </Layout>
  );
}