import { useTranslation } from '../../context/LanguageContext';

interface Props {
  locationFilter: string;
  setLocationFilter: (value: string) => void;
}

const popularFilters = ['All', 'Cox\'s Bazar', 'Sundarbans', 'Sylhet', 'Bandarban'];

export default function PackageFilter({ locationFilter, setLocationFilter }: Props) {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {t('home.packagesDescription')}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Filter:</label>
          <input
            value={locationFilter}
            onChange={e => setLocationFilter(e.target.value)}
            placeholder="Search location"
            className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {popularFilters.map(filter => (
          <button
            type="button"
            key={filter}
            onClick={() => setLocationFilter(filter === 'All' ? '' : filter)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              locationFilter === filter || (filter === 'All' && !locationFilter)
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}
