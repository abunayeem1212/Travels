import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { Testimonial } from '../../types';
import { commonApi } from '../../api/services';

export default function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>([]);

  useEffect(() => {
    commonApi.getTestimonials()
      .then(res => setItems(res.data))
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-16 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            What Our Clients Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id}
              className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex mb-3">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} size={16}
                    className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                "{item.reviewText}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex
                  items-center justify-center text-blue-600 font-bold">
                  {item.customerName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {item.customerName}
                  </p>
                  {item.location && (
                    <p className="text-gray-400 text-xs">{item.location}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}