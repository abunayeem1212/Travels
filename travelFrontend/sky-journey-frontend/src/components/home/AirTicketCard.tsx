import { Plane, Briefcase, Luggage } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { AirTicket } from '../../types';
import PlaceholderImage from '../common/PlaceholderImage';

interface Props {
  ticket: AirTicket;
  onBookClick: (ticket: AirTicket) => void;
}

export default function AirTicketCard({ ticket, onBookClick }: Props) {
  const { isBangla } = useLanguage();

  const airlineName = isBangla ? ticket.airlineNameBn : ticket.airlineName;
  const fromCity = isBangla ? ticket.fromCityBn : ticket.fromCity;
  const toCity = isBangla ? ticket.toCityBn : ticket.toCity;
  const tripType = isBangla ? ticket.tripTypeBn : ticket.tripType;
  const flightClass = isBangla ? ticket.flightClassBn : ticket.flightClass;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md
      hover:shadow-xl transition-shadow duration-300 overflow-hidden
      border border-gray-100 dark:border-gray-700">

      {/* Header — Airline Info */}
      <div className="flex items-center justify-between p-4
        border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30
            flex items-center justify-center overflow-hidden shrink-0">
            {ticket.airlineLogoUrl ? (
              <PlaceholderImage
                src={ticket.airlineLogoUrl}
                alt={airlineName}
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <Plane size={20} className="text-blue-500" />
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-white
              text-sm">
              {airlineName}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {flightClass}
            </p>
          </div>
        </div>

        {ticket.isPopular && (
          <span className="bg-orange-100 dark:bg-orange-900/40
            text-orange-600 dark:text-orange-300 text-xs font-semibold
            px-2.5 py-1 rounded-full">
            {isBangla ? 'জনপ্রিয়' : 'Popular'}
          </span>
        )}
      </div>

      {/* Route */}
      <div className="px-4 py-5">
        <div className="flex items-center justify-between">

          {/* From */}
          <div className="text-center flex-1">
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {fromCity.slice(0, 3).toUpperCase()}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500
              mt-1 truncate">
              {fromCity}
            </p>
          </div>

          {/* Plane Icon + Line */}
          <div className="flex-1 flex items-center justify-center
            relative px-2">
            <div className="w-full border-t-2 border-dashed
              border-gray-200 dark:border-gray-600" />
            <div className="absolute bg-white dark:bg-gray-800 px-1">
              <Plane size={18} className="text-blue-500 rotate-90" />
            </div>
          </div>

          {/* To */}
          <div className="text-center flex-1">
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {toCity.slice(0, 3).toUpperCase()}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500
              mt-1 truncate">
              {toCity}
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500
          mt-3">
          {tripType}
        </p>
      </div>

      {/* Baggage Info */}
      <div className="grid grid-cols-2 gap-3 px-4 pb-4">
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3
          flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/40
            rounded-lg flex items-center justify-center shrink-0">
            <Luggage size={16} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {isBangla ? 'চেক-ইন ব্যাগেজ' : 'Checked Baggage'}
            </p>
            <p className="text-sm font-bold text-gray-800 dark:text-white">
              {ticket.checkedBaggageKg} {isBangla ? 'কেজি' : 'kg'}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3
          flex items-center gap-2.5">
          <div className="w-9 h-9 bg-green-100 dark:bg-green-900/40
            rounded-lg flex items-center justify-center shrink-0">
            <Briefcase size={16} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {isBangla ? 'ক্যাবিন ব্যাগেজ' : 'Cabin Baggage'}
            </p>
            <p className="text-sm font-bold text-gray-800 dark:text-white">
              {ticket.cabinBaggageKg} {isBangla ? 'কেজি' : 'kg'}
            </p>
          </div>
        </div>
      </div>

      {/* Price + Book */}
      <div className="flex items-center justify-between px-4 py-4
        border-t border-gray-100 dark:border-gray-700
        bg-gray-50 dark:bg-gray-900/30">
        <div>
          {ticket.discountPrice ? (
            <div>
              <span className="text-gray-400 line-through text-xs">
                ৳{ticket.price.toLocaleString()}
              </span>
              <p className="text-blue-600 font-bold text-xl">
                ৳{ticket.discountPrice.toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="text-blue-600 font-bold text-xl">
              ৳{ticket.price.toLocaleString()}
            </p>
          )}
          <span className="text-gray-400 text-xs">
            {isBangla ? 'জনপ্রিয়' : 'Popular'}
          </span>
        </div>

        <button onClick={() => onBookClick(ticket)}
          className="bg-blue-600 text-white text-sm font-semibold
            px-5 py-2.5 rounded-xl hover:bg-blue-700 transition">
          {isBangla ? 'বুক করুন' : 'Book Now'}
        </button>
      </div>
    </div>
  );
}