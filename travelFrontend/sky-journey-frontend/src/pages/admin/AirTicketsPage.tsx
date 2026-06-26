import { useEffect, useState, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Plane, Upload } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { AirTicket } from '../../types';
import { airTicketApi } from '../../api/services';
import toast from 'react-hot-toast';

const emptyForm = {
  airlineName: '', fromCity: '', toCity: '', tripType: 'One Way',
  flightClass: 'Economy',
  airlineNameBn: '', fromCityBn: '', toCityBn: '', tripTypeBn: 'একমুখী',
  flightClassBn: 'ইকোনমি',
  checkedBaggageKg: 20, cabinBaggageKg: 7,
  price: 0, discountPrice: '',
  description: '', descriptionBn: '',
  isPopular: false, isActive: true, displayOrder: 0
};

export default function AdminAirTicketsPage() {
  const [tickets, setTickets] = useState<AirTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const load = () => {
    airTicketApi.getAdminList()
      .then(res => setTickets(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditId(null);
    setLogoFile(null);
    setLogoPreview('');
    setShowModal(true);
  };

  const openEdit = (ticket: AirTicket) => {
    setForm({
      airlineName: ticket.airlineName,
      fromCity: ticket.fromCity,
      toCity: ticket.toCity,
      tripType: ticket.tripType,
      flightClass: ticket.flightClass,
      airlineNameBn: ticket.airlineNameBn,
      fromCityBn: ticket.fromCityBn,
      toCityBn: ticket.toCityBn,
      tripTypeBn: ticket.tripTypeBn,
      flightClassBn: ticket.flightClassBn,
      checkedBaggageKg: ticket.checkedBaggageKg,
      cabinBaggageKg: ticket.cabinBaggageKg,
      price: ticket.price,
      discountPrice: ticket.discountPrice?.toString() || '',
      description: '',
      descriptionBn: '',
      isPopular: ticket.isPopular,
      isActive: true,
      displayOrder: 0
    });
    setLogoPreview(ticket.airlineLogoUrl || '');
    setLogoFile(null);
    setEditId(ticket.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.airlineName || !form.fromCity || !form.toCity || !form.price) {
      toast.error('Airline, route এবং price পূরণ করুন');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice
          ? Number(form.discountPrice) : null,
        checkedBaggageKg: Number(form.checkedBaggageKg),
        cabinBaggageKg: Number(form.cabinBaggageKg),
      };

      let ticketId = editId;
      if (editId) {
        await airTicketApi.update(editId, payload);
        toast.success('আপডেট হয়েছে!');
      } else {
        const res = await airTicketApi.create(payload);
        ticketId = res.data.id;
        toast.success('তৈরি হয়েছে!');
      }

      if (logoFile && ticketId) {
        await airTicketApi.uploadLogo(ticketId, logoFile);
      }

      setShowModal(false);
      load();
    } catch {
      toast.error('সেভ করতে ব্যর্থ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this air ticket package?')) return;
    try {
      await airTicketApi.delete(id);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            Air Ticket Packages
          </h2>
          <button onClick={openCreate}
            className="flex items-center gap-2 bg-blue-600 text-white
              px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
            <Plus size={16} /> Add Ticket
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm
          overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : tickets.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No air ticket packages yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50
                  border-b border-gray-100 dark:border-gray-700">
                  <tr>
                    {['Airline', 'Route', 'Class', 'Baggage',
                      'Price', 'Popular', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3
                        text-gray-600 dark:text-gray-400 font-medium
                        whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50
                  dark:divide-gray-700">
                  {tickets.map(ticket => (
                    <tr key={ticket.id} className="hover:bg-gray-50
                      dark:hover:bg-gray-700/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-50
                            dark:bg-blue-900/30 flex items-center
                            justify-center overflow-hidden shrink-0">
                            {ticket.airlineLogoUrl ? (
                              <img src={ticket.airlineLogoUrl} alt=""
                                className="w-full h-full object-contain" />
                            ) : (
                              <Plane size={14} className="text-blue-500" />
                            )}
                          </div>
                          <span className="font-medium text-gray-800
                            dark:text-white">
                            {ticket.airlineName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500
                        dark:text-gray-400">
                        {ticket.fromCity} → {ticket.toCity}
                      </td>
                      <td className="px-4 py-3 text-gray-500
                        dark:text-gray-400">
                        {ticket.flightClass}
                      </td>
                      <td className="px-4 py-3 text-gray-500
                        dark:text-gray-400 text-xs">
                        {ticket.checkedBaggageKg}kg + {ticket.cabinBaggageKg}kg
                      </td>
                      <td className="px-4 py-3 text-blue-600 font-medium">
                        ৳{(ticket.discountPrice || ticket.price)
                          .toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {ticket.isPopular ? (
                          <span className="bg-orange-100 text-orange-600
                            text-xs px-2 py-1 rounded-full">Popular</span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(ticket)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50
                              dark:hover:bg-blue-900/20 rounded-lg
                              transition">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => handleDelete(ticket.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50
                              dark:hover:bg-red-900/20 rounded-lg
                              transition">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center
          justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full
            max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b
              border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-white">
                {editId ? 'Edit Air Ticket' : 'Add Air Ticket'}
              </h3>
              <button onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100
                  dark:hover:bg-gray-700 flex items-center justify-center">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-5">

              {/* Logo Upload */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gray-50
                  dark:bg-gray-900 flex items-center justify-center
                  overflow-hidden cursor-pointer border-2 border-dashed
                  border-gray-200 dark:border-gray-700"
                  onClick={() => inputRef.current?.click()}>
                  {logoPreview ? (
                    <img src={logoPreview} alt=""
                      className="w-full h-full object-contain p-1" />
                  ) : (
                    <Upload size={20} className="text-gray-300" />
                  )}
                </div>
                <div>
                  <button onClick={() => inputRef.current?.click()}
                    className="text-sm text-blue-600 hover:underline">
                    Upload Airline Logo
                  </button>
                  <p className="text-xs text-gray-400 mt-0.5">
                    PNG with transparent background recommended
                  </p>
                </div>
                <input ref={inputRef} type="file" accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setLogoFile(f);
                    setLogoPreview(URL.createObjectURL(f));
                  }} />
              </div>

              {/* English Section */}
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl
                p-4 space-y-3">
                <p className="text-sm font-semibold text-blue-700
                  dark:text-blue-300">🇬🇧 English</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500
                      dark:text-gray-400 mb-1 block">Airline Name *</label>
                    <input value={form.airlineName}
                      onChange={e => setForm({
                        ...form, airlineName: e.target.value
                      })}
                      className="w-full border border-gray-200
                        dark:border-gray-700 bg-white dark:bg-gray-800
                        text-gray-800 dark:text-gray-200 rounded-lg px-3
                        py-2 text-sm focus:outline-none focus:ring-2
                        focus:ring-blue-500"
                      placeholder="Biman Bangladesh Airlines" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500
                      dark:text-gray-400 mb-1 block">Class</label>
                    <select value={form.flightClass}
                      onChange={e => setForm({
                        ...form, flightClass: e.target.value
                      })}
                      className="w-full border border-gray-200
                        dark:border-gray-700 bg-white dark:bg-gray-800
                        text-gray-800 dark:text-gray-200 rounded-lg px-3
                        py-2 text-sm focus:outline-none focus:ring-2
                        focus:ring-blue-500">
                      <option>Economy</option>
                      <option>Business</option>
                      <option>First Class</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500
                      dark:text-gray-400 mb-1 block">From City *</label>
                    <input value={form.fromCity}
                      onChange={e => setForm({
                        ...form, fromCity: e.target.value
                      })}
                      className="w-full border border-gray-200
                        dark:border-gray-700 bg-white dark:bg-gray-800
                        text-gray-800 dark:text-gray-200 rounded-lg px-3
                        py-2 text-sm focus:outline-none focus:ring-2
                        focus:ring-blue-500"
                      placeholder="Dhaka" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500
                      dark:text-gray-400 mb-1 block">To City *</label>
                    <input value={form.toCity}
                      onChange={e => setForm({
                        ...form, toCity: e.target.value
                      })}
                      className="w-full border border-gray-200
                        dark:border-gray-700 bg-white dark:bg-gray-800
                        text-gray-800 dark:text-gray-200 rounded-lg px-3
                        py-2 text-sm focus:outline-none focus:ring-2
                        focus:ring-blue-500"
                      placeholder="Cox's Bazar" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-gray-500
                      dark:text-gray-400 mb-1 block">Trip Type</label>
                    <select value={form.tripType}
                      onChange={e => setForm({
                        ...form, tripType: e.target.value
                      })}
                      className="w-full border border-gray-200
                        dark:border-gray-700 bg-white dark:bg-gray-800
                        text-gray-800 dark:text-gray-200 rounded-lg px-3
                        py-2 text-sm focus:outline-none focus:ring-2
                        focus:ring-blue-500">
                      <option>One Way</option>
                      <option>Round Trip</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bangla Section */}
              <div className="bg-green-50 dark:bg-green-900/10 rounded-xl
                p-4 space-y-3">
                <p className="text-sm font-semibold text-green-700
                  dark:text-green-300">🇧🇩 বাংলা</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500
                      dark:text-gray-400 mb-1 block">এয়ারলাইনের নাম *</label>
                    <input value={form.airlineNameBn}
                      onChange={e => setForm({
                        ...form, airlineNameBn: e.target.value
                      })}
                      className="w-full border border-gray-200
                        dark:border-gray-700 bg-white dark:bg-gray-800
                        text-gray-800 dark:text-gray-200 rounded-lg px-3
                        py-2 text-sm focus:outline-none focus:ring-2
                        focus:ring-green-500"
                      placeholder="বিমান বাংলাদেশ এয়ারলাইন্স" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500
                      dark:text-gray-400 mb-1 block">ক্লাস</label>
                    <select value={form.flightClassBn}
                      onChange={e => setForm({
                        ...form, flightClassBn: e.target.value
                      })}
                      className="w-full border border-gray-200
                        dark:border-gray-700 bg-white dark:bg-gray-800
                        text-gray-800 dark:text-gray-200 rounded-lg px-3
                        py-2 text-sm focus:outline-none focus:ring-2
                        focus:ring-green-500">
                      <option>ইকোনমি</option>
                      <option>বিজনেস</option>
                      <option>ফার্স্ট ক্লাস</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500
                      dark:text-gray-400 mb-1 block">যাত্রা শুরু *</label>
                    <input value={form.fromCityBn}
                      onChange={e => setForm({
                        ...form, fromCityBn: e.target.value
                      })}
                      className="w-full border border-gray-200
                        dark:border-gray-700 bg-white dark:bg-gray-800
                        text-gray-800 dark:text-gray-200 rounded-lg px-3
                        py-2 text-sm focus:outline-none focus:ring-2
                        focus:ring-green-500"
                      placeholder="ঢাকা" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500
                      dark:text-gray-400 mb-1 block">গন্তব্য *</label>
                    <input value={form.toCityBn}
                      onChange={e => setForm({
                        ...form, toCityBn: e.target.value
                      })}
                      className="w-full border border-gray-200
                        dark:border-gray-700 bg-white dark:bg-gray-800
                        text-gray-800 dark:text-gray-200 rounded-lg px-3
                        py-2 text-sm focus:outline-none focus:ring-2
                        focus:ring-green-500"
                      placeholder="কক্সবাজার" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-gray-500
                      dark:text-gray-400 mb-1 block">ট্রিপ টাইপ</label>
                    <select value={form.tripTypeBn}
                      onChange={e => setForm({
                        ...form, tripTypeBn: e.target.value
                      })}
                      className="w-full border border-gray-200
                        dark:border-gray-700 bg-white dark:bg-gray-800
                        text-gray-800 dark:text-gray-200 rounded-lg px-3
                        py-2 text-sm focus:outline-none focus:ring-2
                        focus:ring-green-500">
                      <option>একমুখী</option>
                      <option>রাউন্ড ট্রিপ</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Baggage + Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700
                    dark:text-gray-300 mb-1 block">
                    Checked Baggage (kg)
                  </label>
                  <input type="number" value={form.checkedBaggageKg}
                    onChange={e => setForm({
                      ...form, checkedBaggageKg: +e.target.value
                    })}
                    className="w-full border border-gray-200
                      dark:border-gray-700 bg-white dark:bg-gray-800
                      text-gray-800 dark:text-gray-200 rounded-lg px-3
                      py-2.5 text-sm focus:outline-none focus:ring-2
                      focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700
                    dark:text-gray-300 mb-1 block">
                    Cabin Baggage (kg)
                  </label>
                  <input type="number" value={form.cabinBaggageKg}
                    onChange={e => setForm({
                      ...form, cabinBaggageKg: +e.target.value
                    })}
                    className="w-full border border-gray-200
                      dark:border-gray-700 bg-white dark:bg-gray-800
                      text-gray-800 dark:text-gray-200 rounded-lg px-3
                      py-2.5 text-sm focus:outline-none focus:ring-2
                      focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700
                    dark:text-gray-300 mb-1 block">Price (৳) *</label>
                  <input type="number" value={form.price}
                    onChange={e => setForm({
                      ...form, price: +e.target.value
                    })}
                    className="w-full border border-gray-200
                      dark:border-gray-700 bg-white dark:bg-gray-800
                      text-gray-800 dark:text-gray-200 rounded-lg px-3
                      py-2.5 text-sm focus:outline-none focus:ring-2
                      focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700
                    dark:text-gray-300 mb-1 block">
                    Discount Price (৳)
                  </label>
                  <input type="number" value={form.discountPrice}
                    onChange={e => setForm({
                      ...form, discountPrice: e.target.value
                    })}
                    className="w-full border border-gray-200
                      dark:border-gray-700 bg-white dark:bg-gray-800
                      text-gray-800 dark:text-gray-200 rounded-lg px-3
                      py-2.5 text-sm focus:outline-none focus:ring-2
                      focus:ring-blue-500" />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isPopular}
                    onChange={e => setForm({
                      ...form, isPopular: e.target.checked
                    })}
                    className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700
                    dark:text-gray-300">Mark as Popular</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive}
                    onChange={e => setForm({
                      ...form, isActive: e.target.checked
                    })}
                    className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700
                    dark:text-gray-300">Active</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200
                    dark:border-gray-600 text-gray-600 dark:text-gray-300
                    py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700
                    transition text-sm">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 bg-blue-600 text-white py-2.5
                    rounded-lg hover:bg-blue-700 transition text-sm
                    disabled:opacity-60">
                  {saving ? 'Saving...' : 'Save Ticket'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}