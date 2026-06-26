import Navbar from './Navbar';
import Footer from './Footer';
import CountdownBanner from '../home/CountdownBanner';
import FloatingButtons from './FloatingButtons';
import CookieConsent from './CookieConsent';

interface Props {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export default function Layout({ children, hideFooter = false }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <CountdownBanner />
      <main className="flex-1">
        {children}
      </main>
      {!hideFooter && <Footer />}
      <FloatingButtons />
      <CookieConsent />
    </div>
  );
}