import { ShieldCheck, Sparkles, Compass, Users } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

export default function AboutSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {t('home.aboutTitle')}
            </h2>
            <p className="text-gray-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              {t('home.aboutDescription')}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { icon: <ShieldCheck size={24} />, title: t('home.featureTrusted') },
                { icon: <Sparkles size={24} />, title: t('home.featureFlexible') },
                { icon: <Compass size={24} />, title: t('home.featureSupport') },
                { icon: <Users size={24} />, title: t('home.featureSustainable') },
              ].map(item => (
                <div key={item.title} className="flex gap-4 bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-200">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('home.aboutDescription')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-xl bg-white dark:bg-slate-800">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80"
              alt="Travel experience"
              className="w-full h-full object-cover min-h-[420px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
