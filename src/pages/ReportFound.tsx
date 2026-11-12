import { useState, useRef, type FormEvent, type ChangeEvent, type DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Package,
  Upload,
  X,
  ImagePlus,
  CalendarDays,
  Clock,
  MapPin,
  Tag,
  Palette,
  FileText,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createItem, uploadImage } from '@/services/itemService';
import { CATEGORIES, CAMPUS_LOCATIONS, ITEM_COLOURS } from '@/lib/constants';
import type { ItemCategory, CampusLocation } from '@/types';

interface FormData {
  item_name: string;
  category: string;
  description: string;
  colour: string;
  location: string;
  item_date: string;
  approximate_time: string;
  private_details: string;
}

interface FormErrors {
  item_name?: string;
  category?: string;
  description?: string;
  colour?: string;
  location?: string;
  item_date?: string;
}

export default function ReportFound() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    item_name: '',
    category: '',
    description: '',
    colour: '',
    location: '',
    item_date: format(new Date(), 'yyyy-MM-dd'),
    approximate_time: '',
    private_details: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // ─── Image handling ────────────────────────
  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageSelect(file);
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageSelect(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ─── Validation ────────────────────────────
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.item_name.trim()) newErrors.item_name = 'Item name is required';
    if (!form.category) newErrors.category = 'Please select a category';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.colour) newErrors.colour = 'Please select a colour';
    if (!form.location) newErrors.location = 'Please select a location';
    if (!form.item_date) newErrors.item_date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Submit ────────────────────────────────
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const tempId = `found-${Date.now()}`;
      let image_url: string | undefined;

      if (imageFile) {
        image_url = await uploadImage(imageFile, tempId);
      }

      await createItem({
        user_id: profile?.id || 'demo-student-2',
        type: 'FOUND',
        item_name: form.item_name.trim(),
        category: form.category as ItemCategory,
        description: form.description.trim(),
        colour: form.colour,
        location: form.location as CampusLocation,
        item_date: form.item_date,
        approximate_time: form.approximate_time || undefined,
        image_url,
        private_details: form.private_details.trim() || undefined,
        status: 'ACTIVE',
      });

      setSuccess(true);
      setTimeout(() => navigate('/my-reports'), 1800);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Success state ─────────────────────────
  if (success) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="card max-w-md w-full text-center p-10 animate-fade-in">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-5">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your found item report has been submitted. Our AI matching engine will automatically try
            to match it with lost item reports.
          </p>
          <p className="text-sm text-gray-400">Redirecting to your reports…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-emerald-100">
            <Package className="w-6 h-6 text-emerald-600" />
          </div>
          <h1 className="page-title mb-0">Report Found Item</h1>
        </div>
        <p className="page-subtitle ml-[52px]">
          Report an item you've found to help reunite it with its owner.
        </p>
      </div>

      {/* Security reminder */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Security Reminder</p>
            <p className="text-sm text-amber-700 mt-0.5">
              For valuable items like wallets with cards, electronics, or important documents,
              consider also submitting them to <span className="font-medium">campus security</span> for
              safekeeping until the owner is found.
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="card p-6 sm:p-8 space-y-6">
          {/* Error banner */}
          {submitError && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}

          {/* Item Name */}
          <div>
            <label htmlFor="item_name" className="label flex items-center gap-1.5">
              <Tag className="w-4 h-4" /> Item Name
            </label>
            <input
              type="text"
              id="item_name"
              name="item_name"
              value={form.item_name}
              onChange={handleChange}
              placeholder="e.g. Blue Water Bottle"
              className={`input-field ${errors.item_name ? 'ring-2 ring-red-400' : ''}`}
            />
            {errors.item_name && (
              <p className="text-xs text-red-500 mt-1">{errors.item_name}</p>
            )}
          </div>

          {/* Category + Colour row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="label flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> Category
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`select-field ${errors.category ? 'ring-2 ring-red-400' : ''}`}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs text-red-500 mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <label htmlFor="colour" className="label flex items-center gap-1.5">
                <Palette className="w-4 h-4" /> Colour
              </label>
              <select
                id="colour"
                name="colour"
                value={form.colour}
                onChange={handleChange}
                className={`select-field ${errors.colour ? 'ring-2 ring-red-400' : ''}`}
              >
                <option value="">Select colour</option>
                {ITEM_COLOURS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.colour && (
                <p className="text-xs text-red-500 mt-1">{errors.colour}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="label flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the item — where exactly you found it, condition, any distinguishing features…"
              className={`input-field resize-none ${errors.description ? 'ring-2 ring-red-400' : ''}`}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="label flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> Location Where Found
            </label>
            <select
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              className={`select-field ${errors.location ? 'ring-2 ring-red-400' : ''}`}
            >
              <option value="">Select location</option>
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            {errors.location && (
              <p className="text-xs text-red-500 mt-1">{errors.location}</p>
            )}
          </div>

          {/* Date + Time row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="item_date" className="label flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4" /> Date Found
              </label>
              <input
                type="date"
                id="item_date"
                name="item_date"
                value={form.item_date}
                onChange={handleChange}
                max={format(new Date(), 'yyyy-MM-dd')}
                className={`input-field ${errors.item_date ? 'ring-2 ring-red-400' : ''}`}
              />
              {errors.item_date && (
                <p className="text-xs text-red-500 mt-1">{errors.item_date}</p>
              )}
            </div>

            <div>
              <label htmlFor="approximate_time" className="label flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Approximate Time
                <span className="text-xs font-normal text-gray-400">(optional)</span>
              </label>
              <input
                type="time"
                id="approximate_time"
                name="approximate_time"
                value={form.approximate_time}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          {/* Photo upload */}
          <div>
            <label className="label flex items-center gap-1.5 mb-2">
              <ImagePlus className="w-4 h-4" /> Upload Photo
              <span className="text-xs font-normal text-gray-400">(optional)</span>
            </label>

            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-64 object-contain mx-auto"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 p-1.5 bg-white/90 hover:bg-white rounded-lg shadow-md transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            ) : (
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`flex flex-col items-center justify-center gap-2 p-8 rounded-xl border-2 border-dashed transition-colors cursor-pointer ${
                  isDragging
                    ? 'border-indigo-400 bg-indigo-50'
                    : 'border-gray-300 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/50'
                }`}
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <p className="text-sm text-gray-600 font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
          </div>

          {/* Private Details */}
          <div>
            <label htmlFor="private_details" className="label flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Private Details
              <span className="text-xs font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              id="private_details"
              name="private_details"
              rows={3}
              value={form.private_details}
              onChange={handleChange}
              placeholder="e.g. Found near bench #3, screen was cracked on the left side…"
              className="input-field resize-none"
            />
            <p className="text-xs text-gray-400 mt-1.5 flex items-start gap-1">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              These details are kept private and used for ownership verification.
            </p>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full flex items-center justify-center gap-2 text-base py-3"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  <Package className="w-5 h-5" />
                  Submit Found Report
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
