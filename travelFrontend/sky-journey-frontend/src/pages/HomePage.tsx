import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/common/Layout';
import HeroSection from '../components/home/HeroSection';
import PackageCard from '../components/home/PackageCard';
import HotelCard from '../components/home/HotelCard';
import ContactSection from '../components/home/ContactSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import AboutSection from '../components/home/AboutSection';
import PackageFilter from '../components/home/PackageFilter';
import { useTranslation } from '../context/LanguageContext';
import { Package, Hotel } from '../types';
import { packageApi, hotelApi } from '../api/services';
import { 
  MapPin, Hotel as HotelIcon, Image, Phone, Sparkles, 
  ChevronRight, Award, Clock, Users, Shield, 
  Star, ArrowRight, Calendar, Coffee, Wifi, Car,
   
} from 'lucide-react';
import VideoSection from '../components/home/VideoSection';
import AirTicketSection from '../components/home/AirTicketSection';

export default function HomePage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();

  const filteredPackages = useMemo(() => {
    if (!locationFilter.trim()) return packages;
    const normalized = locationFilter.trim().toLowerCase();
    return packages.filter(pkg =>
      pkg.location.toLowerCase().includes(normalized) ||
      pkg.title.toLowerCase().includes(normalized)
    );
  }, [locationFilter, packages]);

  useEffect(() => {
    Promise.all([
      packageApi.getAll(true),
      hotelApi.getAll(),
    ])
      .then(([pkgRes, hotelRes]) => {
        setPackages(pkgRes.data);
        setHotels(hotelRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      {/* HERO SECTION */}
      <section className="relative min-h-screen overflow-hidden">
        <HeroSection />
      </section>

      {/* QUICK LINKS - Glassmorphism Cards */}
      <section className="relative -mt-20 z-20 pb-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icon: <MapPin size={24} />, label: t('nav.tourPackages'), href: '#packages', gradient: 'from-orange-500 to-red-500' },
              { icon: <HotelIcon size={24} />, label: t('nav.hotels'), href: '#hotels', gradient: 'from-blue-500 to-cyan-500' },
              { icon: <Image size={24} />, label: t('nav.gallery'), href: '/gallery', gradient: 'from-purple-500 to-pink-500' },
              { icon: <Phone size={24} />, label: t('nav.contact'), href: '#contact', gradient: 'from-green-500 to-emerald-500' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="group relative overflow-hidden rounded-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/20 dark:border-slate-700/50"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                <div className="relative p-6 text-center">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">{item.icon}</div>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm md:text-base">{item.label}</h3>
                  <ChevronRight className="w-4 h-4 mx-auto mt-2 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Award className="w-7 h-7" />, title: "Best Price", desc: "Guaranteed" },
              { icon: <Clock className="w-7 h-7" />, title: "24/7 Support", desc: "Round clock" },
              { icon: <Users className="w-7 h-7" />, title: "Expert Guides", desc: "Local pros" },
              { icon: <Shield className="w-7 h-7" />, title: "Secure", desc: "Booking" },
            ].map((feature, idx) => (
              <div key={idx} className="text-center group cursor-pointer p-4 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all">
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg mb-3 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white">{feature.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


            <AirTicketSection /> 

      {/* PACKAGES SECTION */}
      <section id="packages" className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 text-sm font-medium mb-4">
              <Sparkles size={16} />
              <span>Exclusive Collection</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-white">
              {t('home.popularPackages')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mx-auto mt-4 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              {t('home.packagesDescription')}
            </p>
          </div>

          <div className="mb-10">
            <PackageFilter
              locationFilter={locationFilter}
              setLocationFilter={setLocationFilter}
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-96 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 animate-pulse" />
              ))}
            </div>
          ) : filteredPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/50 dark:bg-slate-800/30 rounded-3xl">
              <p className="text-slate-400 text-lg">{t('home.noResults')}</p>
            </div>
          )}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-orange-300 text-sm font-medium">
              <Star size={16} />
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4">The Ultimate Travel Experience</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-red-500 mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "15K+", label: "Happy Travelers" },
              { number: "500+", label: "Destinations" },
              { number: "10+", label: "Years" },
              { number: "4.9", label: "Rating" },
            ].map((stat, idx) => (
              <div key={idx} className="group">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-slate-300 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOTELS SECTION */}
      <section id="hotels" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
              <HotelIcon size={16} />
              <span>Luxury Stays</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-white">
              {t('home.ourHotels')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mt-4 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              {t('home.hotelsDescription')}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-80 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 animate-pulse" />
              ))}
            </div>
          ) : hotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/30 rounded-3xl">
              <p className="text-slate-400 text-lg">No hotels available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* AMENITIES */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 text-sm font-medium">
              Premium Amenities
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mt-3">Everything You Need</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-3" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Wifi className="w-5 h-5" />, title: "Free WiFi", desc: "Stay connected" },
              { icon: <Car className="w-5 h-5" />, title: "Airport Pickup", desc: "Hassle-free" },
              { icon: <Coffee className="w-5 h-5" />, title: "Breakfast", desc: "Complimentary" },
              { icon: <Calendar className="w-5 h-5" />, title: "Flexible", desc: "Cancellation" },
            ].map((amenity, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center shadow hover:shadow-lg transition-all">
                <div className="inline-flex p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white mb-2">
                  {amenity.icon}
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white text-sm">{amenity.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{amenity.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO SECTION - Original video component, unchanged */}
      <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <VideoSection />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-3">
              <Star size={16} />
              <span>Traveler Stories</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">
              What Our Clients Say
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mt-3" />
          </div>
          <TestimonialsSection />
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <AboutSection />
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-12 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready for Your Next Adventure?</h2>
          <p className="text-orange-100 mb-5">Book your dream vacation today and get exclusive offers</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#packages" className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-orange-600 rounded-lg font-semibold hover:shadow-lg transition-all">
              Explore Packages <ArrowRight size={16} />
            </a>
            <a href="#contact" className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-700 text-white rounded-lg font-semibold hover:bg-orange-800 transition-all">
              Contact Us <Phone size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-16 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <ContactSection />
        </div>
      </section>
    </Layout>
  );
}