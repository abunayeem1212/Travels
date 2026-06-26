import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import PlaceholderImage from '../common/PlaceholderImage';
import { Package } from '../../types';

export default function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl
      transition-shadow duration-300 group">

      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <PlaceholderImage
          src={pkg.coverImage}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-105
            transition-transform duration-500"
        />
        {pkg.isPopular && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white
            text-xs font-semibold px-2 py-1 rounded-full">
            Popular
          </span>
        )}
        {pkg.discountPrice && (
          <span className="absolute top-3 right-3 bg-green-500 text-white
            text-xs font-semibold px-2 py-1 rounded-full">
            Special Price
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">
          {pkg.title}
        </h3>

        <div className="flex items-center gap-1 text-gray-500 text-sm mb-1">
          <MapPin size={14} className="text-blue-500" />
          <span>{pkg.location}</span>
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
          <Clock size={14} className="text-blue-500" />
          <span>{pkg.duration}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {pkg.discountPrice ? (
              <div>
                <span className="text-gray-400 line-through text-sm">
                  ৳{pkg.price.toLocaleString()}
                </span>
                <span className="text-blue-600 font-bold text-xl ml-2">
                  ৳{pkg.discountPrice.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="text-blue-600 font-bold text-xl">
                ৳{pkg.price.toLocaleString()}
              </span>
            )}
            <span className="text-gray-400 text-xs block">per person</span>
          </div>

          <Link to={`/packages/${pkg.slug}`}
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2
              rounded-lg hover:bg-blue-700 transition">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}