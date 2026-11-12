import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Tag,
  Palette,
  Edit,
  XCircle,
  Hand,
  ShieldCheck,
  ImageOff,
  AlertTriangle,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { getItem, updateItem } from '@/services/itemService';
import { ITEM_STATUS_LABELS } from '@/lib/constants';
import StatusBadge from '@/components/StatusBadge';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { Item } from '@/types';

export default function ItemDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [closing, setClosing] = useState(false);

  const isOwner = profile && item && profile.id === item.user_id;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getItem(id)
      .then((data) => {
        if (!data) setError('Item not found.');
        else setItem(data);
      })
      .catch(() => setError('Failed to load item details.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCloseReport = async () => {
    if (!item) return;
    if (!window.confirm('Are you sure you want to close this report?')) return;
    setClosing(true);
    try {
      await updateItem(item.id, { status: 'CLOSED' });
      setItem({ ...item, status: 'CLOSED' });
    } catch {
      setError('Failed to close report.');
    } finally {
      setClosing(false);
    }
  };

  // ─── Loading / Error States ──────────────────────────────
  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" label="Loading item details…" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertTriangle className="w-16 h-16 text-amber-400" />
        <h2 className="text-xl font-semibold text-gray-800">{error || 'Item not found'}</h2>
        <Link to="/explore" className="btn-primary">
          ← Back to Explore
        </Link>
      </div>
    );
  }

  const typeBadge =
    item.type === 'LOST'
      ? 'bg-red-500 text-white'
      : 'bg-emerald-500 text-white';

  const formattedDate = (() => {
    try {
      return format(parseISO(item.item_date), 'MMMM d, yyyy');
    } catch {
      return item.item_date;
    }
  })();

  const formattedCreated = (() => {
    try {
      return format(parseISO(item.created_at), 'MMM d, yyyy · h:mm a');
    } catch {
      return item.created_at;
    }
  })();

  return (
    <div className="page-container animate-fade-in">
      {/* ── Back Button ─────────────────────────────────────── */}
      <Link
        to="/explore"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Explore
      </Link>

      {/* ── Main Content Grid ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── Image Section ───────────────────────────────────── */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[4/3] lg:aspect-auto lg:min-h-[420px]">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.item_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-300">
              <ImageOff className="w-20 h-20" />
              <span className="text-sm text-gray-400">No image provided</span>
            </div>
          )}
          {/* Type overlay */}
          <span className={`badge absolute top-4 left-4 text-sm ${typeBadge}`}>
            {item.type}
          </span>
        </div>

        {/* ── Details Section ─────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {item.item_name}
              </h1>
              <StatusBadge status={item.status} labels={ITEM_STATUS_LABELS} />
            </div>
            <p className="text-sm text-gray-400">
              Reported {formattedCreated}
            </p>
          </div>

          {/* Description */}
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed">{item.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <DetailTile icon={<Tag className="w-4 h-4" />} label="Category" value={item.category} />
            <DetailTile icon={<Palette className="w-4 h-4" />} label="Colour" value={item.colour} />
            <DetailTile icon={<MapPin className="w-4 h-4" />} label="Location" value={item.location} />
            <DetailTile icon={<Calendar className="w-4 h-4" />} label="Date" value={formattedDate} />
            {item.approximate_time && (
              <DetailTile icon={<Clock className="w-4 h-4" />} label="Approx. Time" value={item.approximate_time} />
            )}
          </div>

          {/* ── Private Details (owner only) ───────────────────── */}
          {isOwner && item.private_details && (
            <div className="card border border-amber-200 bg-amber-50/50">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wider">
                  Private Details
                </h3>
              </div>
              <p className="text-amber-900 text-sm leading-relaxed">
                {item.private_details}
              </p>
              <p className="text-xs text-amber-500 mt-2">
                Only visible to you. Used for verification during recovery.
              </p>
            </div>
          )}

          {/* ── Action Buttons ─────────────────────────────────── */}
          <div className="flex flex-wrap gap-3 pt-2">
            {isOwner ? (
              <>
                <Link
                  to={`/report?edit=${item.id}`}
                  className="btn-primary flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Report
                </Link>
                {item.status !== 'CLOSED' && item.status !== 'RETURNED' && (
                  <button
                    onClick={handleCloseReport}
                    disabled={closing}
                    className="btn-danger flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    {closing ? 'Closing…' : 'Close Report'}
                  </button>
                )}
              </>
            ) : profile ? (
              <Link
                to={`/recovery/new?itemId=${item.id}`}
                className="btn-accent flex items-center gap-2"
              >
                <Hand className="w-4 h-4" />
                This is my item!
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Helper: Detail Tile ────────────────────────────────── */
function DetailTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="card flex items-start gap-3">
      <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
