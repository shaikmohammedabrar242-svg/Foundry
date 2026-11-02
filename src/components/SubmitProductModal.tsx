import React, { useState } from 'react';
import { ProductCategory } from '../types';
import { useStore } from '../services/store';
import { uploadAsset } from '../services/supabase';
import { X, Sparkles, Calendar, Tag, Globe, Upload, Image as ImageIcon, Check } from 'lucide-react';

interface SubmitProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES: ProductCategory[] = [
  'AI Tools',
  'Developer Tools',
  'Productivity',
  'Analytics',
  'Finance',
  'Design',
  'Automation',
  'Marketing',
  'Other',
];

const PRESET_LOGOS = [
  { label: 'Activity', url: 'https://api.iconify.design/lucide:activity.svg?color=%23171717' },
  { label: 'Terminal', url: 'https://api.iconify.design/lucide:terminal.svg?color=%23171717' },
  { label: 'Zap', url: 'https://api.iconify.design/lucide:zap.svg?color=%23171717' },
  { label: 'Sparkles', url: 'https://api.iconify.design/lucide:sparkles.svg?color=%23171717' },
  { label: 'Box', url: 'https://api.iconify.design/lucide:box.svg?color=%23171717' },
  { label: 'Layers', url: 'https://api.iconify.design/lucide:layers.svg?color=%23171717' },
];

export const SubmitProductModal: React.FC<SubmitProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { submitProduct, currentUser } = useStore();

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [story, setStory] = useState('');
  const [category, setCategory] = useState<ProductCategory>('AI Tools');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [selectedLogo, setSelectedLogo] = useState(PRESET_LOGOS[0].url);
  const [customLogoUrl, setCustomLogoUrl] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('/src/assets/images/hero_saas_showcase_1793557039852.jpg');
  const [launchNow, setLaunchNow] = useState(true);
  const [launchDate, setLaunchDate] = useState('2026-11-05');
  
  // Deal
  const [hasDeal, setHasDeal] = useState(true);
  const [discountPercent, setDiscountPercent] = useState(30);
  const [dealCode, setDealCode] = useState('LAUNCH30');
  const [dealDescription, setDealDescription] = useState('30% off for early adopters');

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError('');
    const { url, error: uploadErr } = await uploadAsset('product-logos', file, currentUser?.id || 'guest');
    setIsUploading(false);

    if (uploadErr) {
      setError(uploadErr);
    } else if (url) {
      setCustomLogoUrl(url);
      setSelectedLogo(url);
    }
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError('');
    const { url, error: uploadErr } = await uploadAsset('product-screenshots', file, currentUser?.id || 'guest');
    setIsUploading(false);

    if (uploadErr) {
      setError(uploadErr);
    } else if (url) {
      setScreenshotUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a product name');
      return;
    }
    if (!tagline.trim()) {
      setError('Please provide a short tagline');
      return;
    }
    if (!websiteUrl.trim()) {
      setError('Please provide your product website URL');
      return;
    }

    submitProduct({
      name: name.trim(),
      tagline: tagline.trim(),
      description: description.trim() || tagline.trim(),
      story: story.trim(),
      category,
      websiteUrl: websiteUrl.trim(),
      demoUrl: demoUrl.trim() || undefined,
      logoUrl: selectedLogo,
      screenshotUrl: screenshotUrl || '/src/assets/images/hero_saas_showcase_1793557039852.jpg',
      launchNow,
      launchDate: launchNow ? undefined : `${launchDate}T12:00:00Z`,
      deal: hasDeal && dealCode.trim() ? {
        discountPercent: Number(discountPercent) || 20,
        code: dealCode.trim().toUpperCase(),
        description: dealDescription.trim() || `${discountPercent}% off launch discount`,
      } : undefined,
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-white dark:bg-[#141413] border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden text-neutral-900 dark:text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#141413]/95 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-neutral-900 dark:text-white" />
            <h3 className="text-base font-bold">Submit a Product</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3 text-xs rounded-lg bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300 border border-red-200 dark:border-red-900">
              {error}
            </div>
          )}

          {/* Product Name & Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5">Product Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Deploy"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs sm:text-sm focus:outline-hidden focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs sm:text-sm focus:outline-hidden"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5">Short Tagline *</label>
            <input
              type="text"
              required
              placeholder="e.g. Serverless edge deployment without YAML headache"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs sm:text-sm focus:outline-hidden"
            />
          </div>

          {/* Website & Demo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5">Website URL *</label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  required
                  placeholder="https://yourproduct.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs sm:text-sm focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5">Live Interactive Demo URL (Optional)</label>
              <input
                type="text"
                placeholder="https://demo.yourproduct.com"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs sm:text-sm focus:outline-hidden"
              />
            </div>
          </div>

          {/* Full description */}
          <div>
            <label className="block text-xs font-semibold mb-1.5">Description & Backstory</label>
            <textarea
              rows={3}
              placeholder="Explain the workflow pain point your product solves and why you built it..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs sm:text-sm focus:outline-hidden"
            />
          </div>

          {/* Logo Selection & Storage Upload */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold">Product Logo / Icon (Max 2MB)</label>
              <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 cursor-pointer flex items-center gap-1 hover:underline">
                <Upload className="w-3 h-3" />
                <span>Upload Custom Logo</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {customLogoUrl && (
              <div className="mb-3 p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center gap-3">
                <img src={customLogoUrl} alt="Uploaded logo" className="w-8 h-8 object-contain rounded" />
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Custom logo uploaded
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-2.5">
              {PRESET_LOGOS.map((logo) => (
                <button
                  type="button"
                  key={logo.label}
                  onClick={() => {
                    setSelectedLogo(logo.url);
                    setCustomLogoUrl('');
                  }}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs transition-colors ${
                    selectedLogo === logo.url
                      ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900 font-semibold'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 bg-neutral-50 dark:bg-neutral-900'
                  }`}
                >
                  <img
                    src={logo.url}
                    alt={logo.label}
                    className={`w-3.5 h-3.5 ${selectedLogo === logo.url ? 'invert dark:invert-0' : 'dark:invert'}`}
                  />
                  <span>{logo.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Screenshot Storage Upload */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold">Product Preview Screenshot (Max 5MB)</label>
              <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 cursor-pointer flex items-center gap-1 hover:underline">
                <ImageIcon className="w-3 h-3" />
                <span>Upload Screenshot</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleScreenshotUpload}
                  className="hidden"
                />
              </label>
            </div>
            {screenshotUrl && (
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
                <img src={screenshotUrl} alt="Screenshot preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Schedule vs Launch Immediately */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 space-y-3">
            <div className="text-xs font-semibold">Launch Timing</div>
            <div className="flex items-center gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="launchTiming"
                  checked={launchNow}
                  onChange={() => setLaunchNow(true)}
                  className="accent-neutral-900 dark:accent-white"
                />
                <span>Launch Immediately Today</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="launchTiming"
                  checked={!launchNow}
                  onChange={() => setLaunchNow(false)}
                  className="accent-neutral-900 dark:accent-white"
                />
                <span>Schedule on Launch Radar</span>
              </label>
            </div>

            {!launchNow && (
              <div className="pt-2">
                <label className="block text-[11px] text-neutral-500 mb-1">Target Launch Date (UTC)</label>
                <div className="relative max-w-xs">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="date"
                    value={launchDate}
                    onChange={(e) => setLaunchDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs focus:outline-hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Launch Deal / Discount Code */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-xs font-semibold">Exclusive Launch Deal</span>
              </div>
              <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasDeal}
                  onChange={(e) => setHasDeal(e.target.checked)}
                  className="rounded text-neutral-900 accent-neutral-900"
                />
                <span>Include Discount</span>
              </label>
            </div>

            {hasDeal && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] text-neutral-500 mb-1">Discount %</label>
                  <input
                    type="number"
                    min={5}
                    max={90}
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-500 mb-1">Promo Code</label>
                  <input
                    type="text"
                    value={dealCode}
                    onChange={(e) => setDealCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono font-bold focus:outline-hidden uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-500 mb-1">Offer Detail</label>
                  <input
                    type="text"
                    value={dealDescription}
                    onChange={(e) => setDealDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs focus:outline-hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm"
            >
              {isUploading ? 'Uploading Assets...' : 'Publish Product Launch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
