import { Link } from 'react-router-dom';
import { MapPin, Calendar, Eye } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { ITEM_STATUS_LABELS } from '@/lib/constants';
import type { Item } from '@/types';

interface Props {
  item: Item;
}

export default function ItemCard({ item }: Props) {
  return (
    <div className="card group hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-gray-100">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.item_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {/* Type badge */}
        <span className={`absolute top-3 left-3 badge ${
          item.type === 'LOST' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
        }`}>
          {item.type}
        </span>
      </div>

      {/* Info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{item.item_name}</h3>
          <StatusBadge status={item.status} labels={ITEM_STATUS_LABELS} />
        </div>

        <p className="text-sm text-muted line-clamp-2">{item.description}</p>

        <div className="flex items-center gap-4 text-xs text-muted pt-1">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {item.location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(item.item_date).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <span className="badge bg-gray-100 text-gray-600 text-xs">{item.category}</span>
          <span className="badge bg-gray-100 text-gray-600 text-xs">{item.colour}</span>
        </div>

        <Link
          to={`/item/${item.id}`}
          className="flex items-center justify-center gap-2 w-full mt-3 py-2.5 rounded-xl bg-primary/5 text-primary text-sm font-medium hover:bg-primary/10 transition-colors"
        >
          <Eye className="w-4 h-4" />
          View Details
        </Link>
      </div>
    </div>
  );
}

