import { useEffect, useState } from 'react';
import { useTranslation } from '../../context/LanguageContext';

const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 5);
targetDate.setHours(23, 59, 59, 999);

const totalDuration = targetDate.getTime() - Date.now();

function formatRemaining(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export default function CountdownBanner() {
  const { t } = useTranslation();

  const [remainingMs, setRemainingMs] = useState(
    targetDate.getTime() - Date.now()
  );

  const [remaining, setRemaining] = useState(
    formatRemaining(targetDate.getTime() - Date.now())
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      const diff = targetDate.getTime() - Date.now();
      setRemainingMs(diff);
      setRemaining(formatRemaining(diff));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const progress =
    Math.max(0, Math.min(100, (1 - remainingMs / totalDuration) * 100));

  const isUrgent = remainingMs <= 24 * 60 * 60 * 1000;

  return (
    <div
      className={`relative text-white shadow-md transition-all duration-300
      ${isUrgent ? 'bg-red-600 animate-pulse' : 'bg-blue-600'}`}
    >
      {/* ⬇️ tighter container for PC */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-3 sm:px-4 py-2 sm:py-3 text-center sm:text-left">

        <div className="text-sm md:text-base font-medium leading-snug">
          {t('banner.offer')}
        </div>

        <div className="font-semibold text-xs sm:text-sm md:text-base">
          <span>{t('banner.daysLeft')}: </span>
          <span className="bg-white/15 px-2 py-1 rounded-md inline-block">
            {remaining}
          </span>
        </div>
      </div>

      {/* thinner progress bar */}
      <div className="h-0.5 sm:h-1 w-full bg-white/20 overflow-hidden">
        <div
          className="h-full bg-white transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}