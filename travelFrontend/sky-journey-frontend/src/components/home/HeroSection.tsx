import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import { Banner } from '../../types';
import { commonApi } from '../../api/services';

export default function HeroSection() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    commonApi.getBanners()
      .then(res => setBanners(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners]);

  const prev = () => setCurrent(p => (p - 1 + banners.length) % banners.length);
  const next = () => setCurrent(p => (p + 1) % banners.length);

  // Banners না থাকলে fallback hero দেখাবে
  if (banners.length === 0) {
    return (
      <section className="relative h-[85vh] min-h-[500px] bg-gradient-to-br
        from-blue-800 via-blue-600 to-sky-500 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow">
            Explore Bangladesh
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Your Journey, Our Responsibility
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#packages"
              className="bg-white text-blue-700 font-semibold px-6 py-3
                rounded-full hover:bg-blue-50 transition shadow-lg">
              View Packages
            </a>
            <a href="#contact"
              className="border-2 border-white text-white font-semibold
                px-6 py-3 rounded-full hover:bg-white hover:text-blue-700
                transition flex items-center gap-2">
              <Phone size={18} /> Contact Us
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[85vh] min-h-[500px] overflow-hidden">
      {banners.map((banner, i) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-700
            ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow">
                {banner.title}
              </h1>
              {banner.subtitle && (
                <p className="text-xl md:text-2xl mb-8 text-gray-200">
                  {banner.subtitle}
                </p>
              )}
              <div className="flex gap-4 justify-center flex-wrap">
                <a href="#packages"
                  className="bg-blue-600 text-white font-semibold px-6 py-3
                    rounded-full hover:bg-blue-700 transition shadow-lg">
                  View Packages
                </a>
                <a href="#contact"
                  className="border-2 border-white text-white font-semibold
                    px-6 py-3 rounded-full hover:bg-white hover:text-blue-700
                    transition">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Arrows */}
      {banners.length > 1 && (
        <>
          <button onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10
              bg-white/20 hover:bg-white/40 text-white rounded-full flex
              items-center justify-center transition">
            <ChevronLeft size={20} />
          </button>
          <button onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10
              bg-white/20 hover:bg-white/40 text-white rounded-full flex
              items-center justify-center transition">
            <ChevronRight size={20} />
          </button>
          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2
            flex gap-2">
            {banners.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition
                  ${i === current ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}