import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import AirTicketCard from './AirTicketCard';
import InquiryModal from '../common/InquiryModal';
import SkeletonCard from '../common/SkeletonCard';
import { AirTicket } from '../../types';
import { airTicketApi } from '../../api/services';

export default function AirTicketSection() {
  const { isBangla } = useLanguage();
  const [tickets, setTickets] = useState<AirTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingTicket, setBookingTicket] = useState<AirTicket | null>(null);

  useEffect(() => {
    airTicketApi.getAll()
      .then(res => setTickets(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && tickets.length === 0) return null;

  return (
    <section id="air-tickets"
      className="py-16 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4">

        <div className="text-center mb-12">
          <span className="text-blue-600 font-semibold text-sm
            uppercase tracking-wider">
            ✈️ {isBangla ? 'এয়ার টিকেট' : 'Air Tickets'}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800
            dark:text-white mt-2 mb-3">
            {isBangla
              ? 'এয়ার টিকেট প্যাকেজ'
              : 'Air Ticket Packages'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            {isBangla
              ? 'সাশ্রয়ী মূল্যে দেশি ও বিদেশি এয়ারলাইনের টিকেট বুক করুন'
              : 'Book domestic and international flight tickets at the best prices'}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
            gap-6">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
            gap-6">
            {tickets.map(ticket => (
              <AirTicketCard
                key={ticket.id}
                ticket={ticket}
                onBookClick={setBookingTicket}
              />
            ))}
          </div>
        )}
      </div>

      {bookingTicket && (
        <InquiryModal
          title={`${
            isBangla
              ? bookingTicket.airlineNameBn
              : bookingTicket.airlineName
          } — ${
            isBangla
              ? `${bookingTicket.fromCityBn} → ${bookingTicket.toCityBn}`
              : `${bookingTicket.fromCity} → ${bookingTicket.toCity}`
          }`}
          onClose={() => setBookingTicket(null)}
        />
      )}
    </section>
  );
}