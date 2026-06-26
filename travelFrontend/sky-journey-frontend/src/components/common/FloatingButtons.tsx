import { ArrowUp, MessageSquare } from 'lucide-react';

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export default function FloatingButtons() {
  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3">
      <a
        href="https://wa.me/8801700000000"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition"
        aria-label="WhatsApp"
      >
        <MessageSquare size={20} />
      </a>
      <button
        type="button"
        onClick={scrollToTop}
        className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-900 text-white shadow-lg hover:bg-slate-800 transition"
        aria-label="Back to top"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
}

