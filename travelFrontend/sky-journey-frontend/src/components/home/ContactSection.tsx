import { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { commonApi } from '../../api/services';
import { useTranslation } from '../../context/LanguageContext';

export default function ContactSection() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '', phone: '', email: '', subject: '', message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error(t('contact.fillRequired'));
      return;
    }
    setLoading(true);
    try {
      await commonApi.submitContact(form);
      toast.success(t('contact.success'));
      setForm({ name: '', phone: '', email: '', subject: '', message: '' });
    } catch {
      toast.error(t('contact.failure'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4">

        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3">
            {t('home.contactTitle')}
          </h2>
          <p className="text-gray-500 dark:text-slate-400 max-w-xl mx-auto">
            Have a question or need help planning your trip? We're here for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Info */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">{t('contact.getInTouch')}</h3>
            <div className="space-y-5">
              {[
                { icon: <Phone className="text-blue-600" size={20} />,
                  label: 'Phone', value: '+880 1700-000000',
                  href: 'tel:+8801700000000' },
                { icon: <Mail className="text-blue-600" size={20} />,
                  label: 'Email', value: 'info@friendshiptour.com',
                  href: 'mailto:info@friendshiptour.com' },
                { icon: <MapPin className="text-blue-600" size={20} />,
                  label: 'Address', value: '123 Travel Street, Dhaka 1000',
                  href: '#' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex
                    items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{item.label}</p>
                    <a href={item.href}
                      className="font-medium text-gray-800 hover:text-blue-600">
                      {item.value}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="mt-8 h-48 bg-blue-100 rounded-xl flex items-center
              justify-center text-blue-400">
              <MapPin size={32} />
              <span className="ml-2">Map — Dhaka, Bangladesh</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-md p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200 mb-1 block">
                  {t('contact.name')}
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-slate-200 mb-1 block">
                  {t('contact.phone')}
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your phone"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-slate-200 mb-1 block">
                {t('contact.email')}
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5
                  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-slate-200 mb-1 block">
                {t('contact.subject')}
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5
                  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Subject"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-slate-200 mb-1 block">
                {t('contact.message')}
              </label>
              <textarea
                rows={4}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5
                  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                  resize-none"
                placeholder="Your message..."
              />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-3
                rounded-lg hover:bg-blue-700 transition flex items-center
                justify-center gap-2 disabled:opacity-60">
              {loading ? t('contact.sending') : (
                <><Send size={16} /> {t('contact.sendMessage')}</>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}