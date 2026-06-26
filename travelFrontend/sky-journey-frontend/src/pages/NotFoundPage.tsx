import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100
      flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-bold text-blue-200 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/"
          className="inline-flex items-center gap-2 bg-blue-600 text-white
            px-6 py-3 rounded-xl hover:bg-blue-700 transition font-medium">
          <Home size={18} /> Back to Home
        </Link>
      </div>
    </div>
  );
}