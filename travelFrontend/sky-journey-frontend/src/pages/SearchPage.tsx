import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import Layout from '../components/common/Layout';
import PackageCard from '../components/home/PackageCard';
import HotelCard from '../components/home/HotelCard';
import { packageApi, hotelApi } from '../api/services';
import { Package, Hotel } from '../types';
import { Search, Loader2 } from 'lucide-react';

export default function SearchPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [packages, setPackages] = useState<Package[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([packageApi.getAll(), hotelApi.getAll()])
      .then(([pkgRes, hotelRes]) => {
        setPackages(pkgRes.data);
        setHotels(hotelRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const normalizedQuery = query.trim().toLowerCase();

  const matchingPackages = useMemo(() => {
    if (!normalizedQuery) return packages;
    return packages.filter(pkg =>
      pkg.title.toLowerCase().includes(normalizedQuery) ||
      pkg.location.toLowerCase().includes(normalizedQuery)
    );
  }, [packages, normalizedQuery]);

  const matchingHotels = useMemo(() => {
    if (!normalizedQuery) return hotels;
    return hotels.filter(hotel =>
      hotel.name.toLowerCase().includes(normalizedQuery) ||
      hotel.location.toLowerCase().includes(normalizedQuery)
    );
  }, [hotels, normalizedQuery]);

  return (
    <Layout>
      <section className="py-16 bg-slate-50 dark:bg-slate-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
              {t('searchPage.title')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              {t('searchPage.placeholder')}
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t('searchPage.placeholder')}
                className="w-full rounded-full border border-slate-200 bg-white dark:bg-slate-900 py-4 pl-12 pr-4 text-slate-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="mt-14 space-y-12">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Packages</h2>
                {loading && <div className="inline-flex items-center gap-2 text-slate-500"><Loader2 className="animate-spin" size={18} /> Loading</div>}
              </div>
              {matchingPackages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {matchingPackages.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
                </div>
              ) : (
                <p className="text-center text-slate-500 py-10">{t('searchPage.noResults')}</p>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Hotels</h2>
                {loading && <div className="inline-flex items-center gap-2 text-slate-500"><Loader2 className="animate-spin" size={18} /> Loading</div>}
              </div>
              {matchingHotels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {matchingHotels.map(hotel => <HotelCard key={hotel.id} hotel={hotel} />)}
                </div>
              ) : (
                <p className="text-center text-slate-500 py-10">{t('searchPage.noResults')}</p>
              )}
            </section>
          </div>
        </div>
      </section>
    </Layout>
  );
}
