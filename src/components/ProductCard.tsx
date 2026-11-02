import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../services/store';
import { ChevronUp, ExternalLink, Flame, CheckCircle, Tag, Users, ArrowUpRight, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  variant?: 'featured' | 'standard' | 'compact' | 'trustmrr-row';
  rank?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  variant = 'trustmrr-row',
  rank,
}) => {
  const { currentUser, upvoteProduct, trackClick } = useStore();
  const [clickAnim, setClickAnim] = useState(false);
  const isUpvoted = currentUser ? product.upvotedBy.includes(currentUser.id) : false;

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      onOpenDetails(product);
      return;
    }
    upvoteProduct(product.id);
  };

  const handleTryProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackClick(product.id, 'website');
    setClickAnim(true);
    setTimeout(() => setClickAnim(false), 2000);
    window.open(product.websiteUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDealClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackClick(product.id, 'deal');
    onOpenDetails(product);
  };

  // 1. TRUSTMRR-STYLE VERTICAL LINE ROW (Default high-density layout)
  if (variant === 'trustmrr-row') {
    return (
      <div
        onClick={() => onOpenDetails(product)}
        className="group relative rounded-xl border border-neutral-200/90 dark:border-neutral-800/90 bg-white/80 dark:bg-[#141413]/80 backdrop-blur-xs hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200 cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:shadow-md"
      >
        <div className="flex flex-col lg:flex-row lg:items-stretch">
          
          {/* Column 1: Rank Number (with right vertical line) */}
          {rank !== undefined && (
            <div className="hidden sm:flex items-center justify-center px-4 py-3 sm:py-4 border-b lg:border-b-0 lg:border-r border-neutral-200/80 dark:border-neutral-800/80 shrink-0 bg-neutral-50/50 dark:bg-neutral-900/30">
              <span className="font-mono text-xs sm:text-sm font-bold text-neutral-400 dark:text-neutral-500 w-6 text-center">
                {String(rank).padStart(2, '0')}
              </span>
            </div>
          )}

          {/* Column 2: Logo + Identity & Tagline (with right vertical line) */}
          <div className="flex-1 p-4 sm:p-5 flex items-start sm:items-center gap-4 min-w-0 border-b lg:border-b-0 lg:border-r border-neutral-200/80 dark:border-neutral-800/80">
            {/* Logo */}
            <div className="w-12 h-12 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-2.5 shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <img
                src={product.logoUrl}
                alt={product.name}
                className="w-full h-full object-contain dark:invert"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            {/* Name, Metadata & Tagline */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50 truncate group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                  {product.name}
                </h3>

                {product.isVerified && (
                  <span title="Verified Maker" className="inline-flex items-center">
                    <CheckCircle className="w-3.5 h-3.5 text-neutral-900 dark:text-neutral-100 shrink-0" />
                  </span>
                )}

                {product.isRising && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                    <Flame className="w-3 h-3" />
                    Rising
                  </span>
                )}
              </div>

              {/* Tagline */}
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-1 mt-0.5">
                {product.tagline}
              </p>

              {/* Category & Maker info */}
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 dark:text-neutral-500 mt-1">
                <span className="font-medium text-neutral-700 dark:text-neutral-300">{product.category}</span>
                <span aria-hidden="true">·</span>
                <span>by {product.maker.name}</span>
              </div>
            </div>
          </div>

          {/* Column 3: Live Outbound Visitors (with right vertical line) */}
          <div className="px-5 py-3 lg:py-4 flex items-center justify-between lg:justify-center border-b lg:border-b-0 lg:border-r border-neutral-200/80 dark:border-neutral-800/80 shrink-0 bg-neutral-50/30 dark:bg-neutral-900/20 min-w-[190px]">
            <div className="space-y-0.5 text-left lg:text-center w-full">
              <div className="flex items-center lg:justify-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-mono text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                  {product.websiteClicks.toLocaleString()}
                </span>
                <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-tight">
                  Visitors
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                sent live from Foundry
              </p>
            </div>
          </div>

          {/* Column 4: Deal Badge (with right vertical line) */}
          <div className="px-4 py-3 lg:py-4 flex items-center justify-between lg:justify-center border-b lg:border-b-0 lg:border-r border-neutral-200/80 dark:border-neutral-800/80 shrink-0 min-w-[160px]">
            {product.deal ? (
              <button
                onClick={handleDealClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 transition-colors w-full justify-center"
              >
                <Tag className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>{product.deal.discountPercent}% OFF · {product.deal.code}</span>
              </button>
            ) : (
              <span className="text-xs text-neutral-400 hidden lg:inline font-mono">Standard Plan</span>
            )}
          </div>

          {/* Column 5: Upvote Button (with right vertical line) */}
          <div className="px-4 py-3 lg:py-4 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-neutral-200/80 dark:border-neutral-800/80 shrink-0 min-w-[100px]">
            <button
              onClick={handleUpvote}
              aria-label={`Upvote ${product.name}`}
              className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all w-full lg:w-auto ${
                isUpvoted
                  ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white shadow-xs'
                  : 'bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
              }`}
            >
              <ChevronUp className={`w-3.5 h-3.5 ${isUpvoted ? 'stroke-[2.5]' : ''}`} />
              <span className="font-mono tabular-nums">{product.upvotes}</span>
            </button>
          </div>

          {/* Column 6: Try Product CTA */}
          <div className="p-3 sm:p-4 flex items-center justify-center shrink-0 min-w-[130px]">
            <button
              onClick={handleTryProduct}
              className="w-full flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:text-white dark:hover:text-neutral-900 hover:bg-neutral-900 dark:hover:bg-white border border-neutral-200 dark:border-neutral-800 transition-all shadow-xs"
            >
              <span>Visit</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    );
  }

  // 2. FEATURED HERO SPOTLIGHT (Bento layout with vertical line accents)
  if (variant === 'featured') {
    return (
      <div
        onClick={() => onOpenDetails(product)}
        className="group relative rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white/70 dark:bg-[#141413]/70 backdrop-blur-sm p-6 sm:p-8 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-300 cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-none"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left content info */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Metadata line: Unboxed text with typographic separators */}
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="font-medium text-neutral-900 dark:text-neutral-100">{product.category}</span>
              <span aria-hidden="true">·</span>
              <span>Featured Launch</span>
              {product.isRising && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                    <Flame className="w-3 h-3" />
                    Rising Today
                  </span>
                </>
              )}
            </div>

            {/* Title & Logo */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-2.5 shrink-0">
                <img
                  src={product.logoUrl}
                  alt={product.name}
                  className="w-full h-full object-contain dark:invert"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 line-clamp-2 mt-1">
                  {product.tagline}
                </p>
              </div>
            </div>

            <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-3 leading-relaxed">
              {product.description}
            </p>

            {/* TrustMRR Metrics strip: Live Outbound Visitors + Deal info */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
              {/* Live Outbound Visitors */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{product.websiteClicks.toLocaleString()}</span>
                <span className="text-neutral-500 text-[11px]">visitors sent live</span>
              </div>

              {/* Maker profile */}
              <div className="flex items-center gap-2">
                <img
                  src={product.maker.avatar}
                  alt={product.maker.name}
                  className="w-6 h-6 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
                />
                <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                  {product.maker.name}
                </span>
                {product.isVerified && (
                  <CheckCircle className="w-3.5 h-3.5 text-neutral-900 dark:text-neutral-100" />
                )}
              </div>

              {/* Deal tag if exists */}
              {product.deal && (
                <button
                  onClick={handleDealClick}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 transition-colors"
                >
                  <Tag className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  <span>{product.deal.discountPercent}% OFF · Code: {product.deal.code}</span>
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center gap-3">
              <button
                onClick={handleUpvote}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                  isUpvoted
                    ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white shadow-sm'
                    : 'bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
                }`}
              >
                <ChevronUp className={`w-4 h-4 ${isUpvoted ? 'stroke-[2.5]' : ''}`} />
                <span>Upvote</span>
                <span className="font-mono tabular-nums">{product.upvotes}</span>
              </button>

              <button
                onClick={handleTryProduct}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-transparent text-neutral-800 dark:text-neutral-200 transition-colors"
              >
                <span>Visit Website</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right visual preview */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden border border-neutral-200/90 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 aspect-[16/10] group-hover:shadow-md transition-shadow">
              <img
                src={product.screenshotUrl}
                alt={`${product.name} preview`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-102"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. STANDARD GRID CARD (With vertical line accent & live visitor counter)
  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="group relative flex flex-col justify-between rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#141413]/70 backdrop-blur-xs p-5 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200 cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
    >
      <div>
        {/* Top row: Logo, Name & Live Visitors */}
        <div className="flex items-start gap-3.5 pb-4 border-b border-neutral-100 dark:border-neutral-850">
          <div className="w-11 h-11 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-2 shrink-0">
            <img
              src={product.logoUrl}
              alt={product.name}
              className="w-full h-full object-contain dark:invert"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100 truncate group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                {product.name}
              </h4>
              {product.isVerified && (
                <CheckCircle className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200 shrink-0" />
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span>by {product.maker.name}</span>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-3 line-clamp-2 leading-relaxed">
          {product.tagline}
        </p>

        {/* Live Outbound Visitors indicator */}
        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-850 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
              {product.websiteClicks}
            </span>
            <span className="text-[11px] text-neutral-400">visitors live</span>
          </div>

          {product.deal && (
            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">
              {product.deal.discountPercent}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Footer info & upvote button */}
      <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-850 flex items-center justify-between gap-3">
        <button
          onClick={handleTryProduct}
          className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 flex items-center gap-1 transition-colors"
        >
          <span>Visit Website</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

        {/* Upvote button */}
        <button
          onClick={handleUpvote}
          aria-label={`Upvote ${product.name}`}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
            isUpvoted
              ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white'
              : 'bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
          }`}
        >
          <ChevronUp className={`w-3.5 h-3.5 ${isUpvoted ? 'stroke-[2.5]' : ''}`} />
          <span className="font-mono tabular-nums">{product.upvotes}</span>
        </button>
      </div>
    </div>
  );
};
