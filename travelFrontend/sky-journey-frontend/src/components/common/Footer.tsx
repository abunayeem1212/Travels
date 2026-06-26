import { useState, type ComponentType } from 'react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { FaFacebookF, FaYoutube, FaInstagram } from 'react-icons/fa';
import type { IconBaseProps } from 'react-icons';

const FacebookIcon = FaFacebookF as unknown as ComponentType<IconBaseProps>;
const YoutubeIcon = FaYoutube as unknown as ComponentType<IconBaseProps>;
const InstagramIcon = FaInstagram as unknown as ComponentType<IconBaseProps>;

export default function Footer() {
  const { t } = useTranslation();
  const [showQR, setShowQR] = useState(false);

  const whatsappNumber = "8801839313420";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <footer className="bg-gray-900 dark:bg-slate-950 text-gray-300 pt-12 pb-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                S
              </div>
              <div className="font-bold text-white text-lg">
                The Friendship Tours & Travels
              </div>
            </div>

            <p className="text-sm leading-relaxed text-gray-400">
              Your trusted travel partner in Bangladesh. We make your journey memorable and hassle-free.
            </p>

            {/* Social + WhatsApp */}
            <div className="flex gap-3 mt-4 flex-wrap">

              <a href="https://facebook.com" target="_blank" rel="noreferrer"
                className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition">
                <FacebookIcon size={15} />
              </a>

              <a href="https://youtube.com" target="_blank" rel="noreferrer"
                className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-red-600 transition">
                <YoutubeIcon size={15} />
              </a>

              <a href="https://instagram.com" target="_blank" rel="noreferrer"
                className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-pink-600 transition">
                <InstagramIcon size={15} />
              </a>

              {/* WhatsApp Button */}
              <button
                onClick={() => setShowQR(true)}
                className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition"
              >
                <MessageCircle size={15} />
              </button>

            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: t('nav.home'), path: '/' },
                { label: t('nav.tourPackages'), path: '/#packages' },
                { label: t('nav.hotels'), path: '/#hotels' },
                { label: t('nav.gallery'), path: '/gallery' },
                { label: t('nav.contact'), path: '/#contact' },
              ].map(link => (
                <li key={link.path}>
                  <a href={link.path} className="hover:text-blue-400 transition">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.popularDestinations')}</h3>
            <ul className="space-y-2 text-sm">
              {["Cox's Bazar", "Sundarbans", "Sylhet", "Bandarban",
                "Saint Martin", "Sajek Valley"].map(dest => (
                <li key={dest}>
                  <a href="/#packages" className="hover:text-blue-400 transition">
                    {dest}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.contactUs')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 text-blue-400" />
                <span>123 Travel Street, Dhaka 1000, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-blue-400" />
                <a href="tel:+8801839313420" className="hover:text-blue-400 transition">
                  +880 1839313420
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-blue-400" />
                <a href="mailto:info@friendshiptour.com" className="hover:text-blue-400 transition">
                  info@friendshiptour.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500">
          <p>© 2025 The Friendship Tours & Travels. {t('footer.rights')}</p>
          <p>{t('footer.developed')}</p>
        </div>
      </div>

      {/* ===================== */}
      {/* WhatsApp QR MODAL */}
      {/* ===================== */}
      {showQR && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm text-center">

            <h2 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">
              Chat on WhatsApp
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              Scan QR or click button to start conversation
            </p>

            {/* QR CODE */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${whatsappLink}`}
              alt="WhatsApp QR"
              className="mx-auto rounded-lg"
            />

            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Open WhatsApp
            </a>

            <button
              onClick={() => setShowQR(false)}
              className="block mt-3 text-sm text-gray-500 hover:text-gray-700 mx-auto"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </footer>
  );
}