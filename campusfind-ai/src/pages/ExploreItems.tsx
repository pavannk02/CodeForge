// ──────────────────────────────────────────
// CampusFind AI — Explore Items Page
// ──────────────────────────────────────────
import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  PackageOpen,
  Loader2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { getItems } from '@/services/itemService';
import { CATEGORIES, CAMPUS_LOCATIONS } from '@/lib/constants';
import ItemCard from '@/components/ItemCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { Item, ItemType } from '@/types';

const TYPE_OPTIONS: { label: string; value: '' | ItemType }[] = [
  { label: 'All Items', value: '' },
  { label: 'Lost', value: 'LOST' },
  { label: 'Found', value: 'FOUND' },
];

export default function ExploreItems() {
  // ── Filter state ──────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'' | ItemType>('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  // ── Data state ────────────────────────────────
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounced search to avoid hammering the service
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ── Fetch items whenever filters change ───────
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);

        const filters: Record<string, string | undefined> = {};
        if (typeFilter) filters.type = typeFilter;
        if (categoryFilter) filters.category = categoryFilter;
        if (locationFilter) filters.location = locationFilter;
        if (debouncedSearch.trim()) filters.search = debouncedSearch.trim();

        const data = await getItems(filters as any);
        setItems(data);
      } catch (err) {
        console.error('Failed to fetch items:', err);
        setError('Failed to load items. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [typeFilter, categoryFilter, locationFilter, debouncedSearch]);

  // ── Check if any filters are active ───────────
  const hasActiveFilters = typeFilter || categoryFilter || locationFilter || searchQuery;

  const clearAllFilters = () => {
    setSearchQuery('');
    setTypeFilter('');
    setCategoryFilter('');
    setLocationFilter('');
  };

  // ── Active filter count (for the badge) ───────
  const activeFilterCount = [typeFilter, categoryFilter, locationFilter].filter(Boolean).length;

  return (
    <div className="page-container animate-fade-in">
      {/* ── Page Header ─────────────────────────── */}
      <div className="mb-6">
        <h1 className="page-title">Explore Items</h1>
        <p className="page-subtitle">Browse all lost and found reports across campus</p>
      </div>

      {/* ── Filter Bar ──────────────────────────── */}
      <div className="card mb-6">
        <div className="flex flex-col gap-4">
          {/* Search + Filter Toggle row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Filter dropdowns row */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Type filter — pill buttons */}
            <div className="flex items-center gap-1.5 bg-gray-100 rounded-xl p-1">
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTypeFilter(opt.value)}
                  className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    typeFilter === opt.value
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Category dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="select-field min-w-[160px]"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Location dropdown */}
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="select-field min-w-[160px]"
            >
              <option value="">All Locations</option>
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 whitespace-nowrap"
              >
                <X className="w-3.5 h-3.5" />
                Clear Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 bg-gray-200 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Results Summary ─────────────────────── */}
      {!loading && !error && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">{items.length}</span>{' '}
            {items.length === 1 ? 'item' : 'items'} found
            {hasActiveFilters && ' matching your filters'}
          </p>
        </div>
      )}

      {/* ── Content ─────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="lg" label="Loading items..." />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load items</h3>
          <p className="text-sm text-gray-500 mb-4 max-w-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      ) : items.length === 0 ? (
        /* ── Empty State ───────────────────────── */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
            <PackageOpen className="w-9 h-9 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
          <p className="text-sm text-gray-500 mb-5 max-w-sm">
            {hasActiveFilters
              ? 'No items match your current filters. Try adjusting your search criteria.'
              : 'There are no items reported yet. Be the first to report!'}
          </p>
          {hasActiveFilters && (
            <button onClick={clearAllFilters} className="btn-secondary">
              <X className="w-4 h-4" />
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        /* ── Items Grid ────────────────────────── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ItemCard item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
