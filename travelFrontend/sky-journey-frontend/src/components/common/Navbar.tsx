import { useState, useEffect, type ComponentType } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, Phone, Mail,
  Search, Moon, Sun, Plane
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../context/LanguageContext';
import LiveClock from './LiveClock';
import { FaFacebookF, FaYoutube } from 'react-icons/fa';
import type { IconBaseProps } from 'react-icons';

const FacebookIcon = FaFacebookF as unknown as ComponentType<IconBaseProps>;
const YoutubeIcon = FaYoutube as unknown as ComponentType<IconBaseProps>;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hash, setHash] = useState(window.location.hash);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, lang, setLanguage, isBangla } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navLinks = [
    { label: t('nav.home'), path: '/' },
    { label: isBangla ? 'এয়ার টিকেট' : 'Air Tickets', path: '/#air-tickets' },
    { label: t('nav.tourPackages'), path: '/#packages' },
    { label: t('nav.hotels'), path: '/#hotels' },
    { label: t('nav.gallery'), path: '/gallery' },
    { label: t('nav.contact'), path: '/#contact' },
  ];

  const isActive = (path: string) => {
    if (path.includes('#')) {
      return hash === path.replace('/', '');
    }
    return location.pathname === path && !hash;
  };

  return (
    <header className="w-full sticky top-0 z-50 shadow-sm bg-white/90 backdrop-blur-md dark:bg-slate-950/90 border-b border-slate-100 dark:border-slate-800">

      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-2 text-xs">

          <div className="flex items-center gap-4 min-w-0 overflow-hidden">
            <a href="tel:+8801700000000" className="flex items-center gap-1.5 hover:text-blue-100 transition shrink-0">
              <Phone size={13} />
              <span className="whitespace-nowrap">+880 1700-000000</span>
            </a>
            <a href="mailto:info@friendshiptour.com" className="hidden sm:flex items-center gap-1.5 hover:text-blue-100 transition shrink-0">
              <Mail size={13} />
              <span className="whitespace-nowrap">info@friendshiptour.com</span>
            </a>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:block">
              <LiveClock />
            </div>

                <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-200 transition"
              >
                <FacebookIcon size={15} />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-200 transition"
              >
                <YoutubeIcon size={15} />
              </a>

            <span className="w-px h-4 bg-white/25" />

            {/* Language toggle */}
            <div className="flex items-center rounded-full border border-white/30 p-0.5">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-0.5 rounded-full transition text-[11px] font-medium ${
                  lang === 'en' ? 'bg-amber-400 text-slate-900' : 'text-white/80 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2.5 py-0.5 rounded-full transition text-[11px] font-medium ${
                  lang === 'bn' ? 'bg-amber-400 text-slate-900' : 'text-white/80 hover:text-white'
                }`}
              >
                BN
              </button>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-7 h-7 rounded-full flex items-center justify-center border border-white/30 hover:border-amber-400 hover:text-amber-400 transition shrink-0"
            >
              {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

          {/* Logo - Premium gold */}
          <Link to="/" className="flex items-center gap-3 group shrink-0 min-w-0">
            <div className="relative w-12 h-12 rounded-xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center shadow-md ring-1 ring-amber-400/40 group-hover:ring-amber-400 transition-all shrink-0">
              <Plane size={20} className="text-amber-400 -rotate-45 group-hover:scale-110 transition-transform" />
              <span className="absolute inset-0 rounded-xl border border-amber-400/20" />
            </div>
            <div className="leading-tight min-w-0 truncate">
              <div className="font-bold text-slate-900 dark:text-white text-[15px] md:text-lg tracking-tight truncate">
                The Friendship
                <span className="text-amber-500"> Tours</span> & Travels
              </div>
              <div className="text-[10px] md:text-[11px] uppercase text-slate-500 dark:text-slate-400 tracking-[0.15em] font-medium truncate">
                Your Journey, Our Responsibility
              </div>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map(link => (
              <a
                key={link.path}
                href={link.path}
                className={`relative px-4 py-2 text-sm font-medium tracking-wide rounded-lg transition-colors whitespace-nowrap ${
                  isActive(link.path)
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute left-4 right-4 -bottom-[1px] h-[2px] bg-amber-500 rounded-full" />
                )}
              </a>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">

            {/* Search */}
            <Link
              to="/search"
              className="hidden lg:flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 transition"
            >
              <Search size={16} /> {t('nav.search')}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="hidden lg:flex items-center gap-3">
                <Link to="/admin/dashboard" className="text-sm text-slate-700 dark:text-slate-200 font-medium hover:text-amber-600 dark:hover:text-amber-400 transition whitespace-nowrap">
                  {t('nav.adminPanel')}
                </Link>
                <button
                  onClick={logout}
                  className="text-sm bg-slate-900 text-white px-4 py-2 rounded-full hover:bg-slate-800 transition whitespace-nowrap"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden lg:inline-flex items-center bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-900 px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 dark:hover:bg-amber-400 transition whitespace-nowrap"
              >
                {t('nav.login')}
              </Link>
            )}

            {/* Mobile Toggle */}
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden mt-3 border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1">
            {navLinks.map(link => (
              <a
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive(link.path)
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </a>
            ))}

            <div className="pt-3 px-3">
              <Link
                to="/search"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm dark:bg-slate-900 dark:border-slate-700"
              >
                <Search size={16} /> {t('nav.search')}
              </Link>
            </div>

            <div className="px-3 pt-2">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="text-sm text-slate-700 dark:text-slate-200 font-medium hover:text-amber-600 dark:hover:text-amber-400">
                    {t('nav.adminPanel')}
                  </Link>
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="text-sm bg-slate-900 text-white px-4 py-2 rounded-full hover:bg-slate-800 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-900 px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 dark:hover:bg-amber-400 transition"
                >
                  {t('nav.login')}
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}