import { useEffect, useState } from 'react';
import { useTranslation } from '../../context/LanguageContext';

const STORAGE_KEY = 'skyjourney-cookie-consent';

export default function CookieConsent() {
  const { t } = useTranslation();
  const [accepted, setAccepted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (value === 'accepted') {
      setAccepted(true);
    } else {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    window.localStorage.setItem(STORAGE_KEY, 'accepted');
    setAccepted(true);
    setVisible(false);
  };

  if (!visible || accepted) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 z-50">
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-xl border border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-sm leading-relaxed text-slate-200">
          {t('cookie.message')}
        </p>
        <button
          onClick={handleAccept}
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition"
        >
          {t('cookie.accept')}
        </button>
      </div>
    </div>
  );
}
