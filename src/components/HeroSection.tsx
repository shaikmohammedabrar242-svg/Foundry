import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface HeroSectionProps {
  featuredProduct?: Product;
  onDiscoverClick: () => void;
  onLaunchClick: () => void;
  onOpenDetails: (product: Product) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onDiscoverClick,
  onLaunchClick,
}) => {
  return (
    <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Eyebrow / Manifesto header */}
        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-6">
          <span className="uppercase tracking-widest text-[11px] font-semibold text-neutral-900 dark:text-neutral-100">
            Foundry Platform
          </span>
          <span aria-hidden="true">·</span>
          <span>The Minimalist SaaS Stage</span>
          <span aria-hidden="true">·</span>
          <span>Curated for Indie Founders</span>
        </div>

        {/* Hero headline & value proposition */}
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.08] text-balance">
            Great products deserve an audience.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl text-balance">
            A quiet, minimalist launchpad for solo makers, SaaS founders, and indie hackers to debut their software, reach authentic early adopters, and offer exclusive launch deals.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onDiscoverClick}
              className="px-6 py-3 text-sm font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all duration-200 flex items-center gap-2 shadow-sm"
            >
              <span>Discover Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onLaunchClick}
              className="px-6 py-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200 bg-white/80 dark:bg-neutral-900/80 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
              <span>Launch Your Product</span>
            </button>
          </div>
        </div>

        {/* Editorial Value Strip: Zero-pill, clean typographic micro-manifesto */}
        <div className="mt-16 pt-8 border-t border-neutral-200/60 dark:border-neutral-800/60 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-neutral-500 dark:text-neutral-400">
          <div>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 block mb-1">
              01. Authentic Attention
            </span>
            <span>Real founders and software enthusiasts. No algorithm noise, artificial scorecards, or spam rings.</span>
          </div>
          <div>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 block mb-1">
              02. Exclusive Launch Deals
            </span>
            <span>Support early builders with discount codes and lifetime upgrades for early adopters.</span>
          </div>
          <div>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 block mb-1">
              03. Transparent Analytics
            </span>
            <span>Makers see honest views, website visits, deal activations, and customer click-throughs.</span>
          </div>
        </div>

      </div>
    </section>
  );
};
