import { useEffect, useState } from 'react';

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function LiveClock() {
  const [time, setTime] = useState(formatTime(new Date()));

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTime(formatTime(new Date()));
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="text-xs text-white/80 tracking-wide">
      {time}
    </div>
  );
}
