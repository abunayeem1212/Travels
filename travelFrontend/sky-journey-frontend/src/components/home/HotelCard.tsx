import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import PlaceholderImage from '../common/PlaceholderImage';
import { Hotel } from '../../types';

export default function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl
      transition-shadow duration-300 group">

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <PlaceholderImage
          src={hotel.coverImage}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105
            transition-transform duration-500"
        />
        {/* Star Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm
          px-2 py-1 rounded-full flex items-center gap-1">
          {Array.from({ length: hotel.starRating }).map((_, i) => (
            <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-1">
          {hotel.name}
        </h3>

        <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
          <MapPin size={14} className="text-blue-500" />
          <span>{hotel.location}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-blue-600 font-bold text-xl">
              ৳{hotel.pricePerNight.toLocaleString()}
            </span>
            <span className="text-gray-400 text-xs block">per night</span>
          </div>

          <Link to={`/hotels/${hotel.slug}`}
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2
              rounded-lg hover:bg-blue-700 transition">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}