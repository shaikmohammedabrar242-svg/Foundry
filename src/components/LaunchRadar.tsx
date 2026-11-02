import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useStore } from '../services/store';
import { formatCountdown } from '../utils/time';
import { Bell, Check, Clock, Calendar } from 'lucide-react';

interface LaunchRadarProps {
  products: Product[];
  onOpenDetails: (product: Product) => void;
}

export const LaunchRadar: React.FC<LaunchRadarProps> = ({ products, onOpenDetails }) => {
  const { currentUser, joinWaitlist } = useStore();
  const [now, setNow] = useState(Date.now());
  const [waitlistSuccessMap, setWaitlistSuccessMap] = useState<Record<string, boolean>>({});

  // 1-second interval to update live countdown tickers
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const upcomingProducts = products.filter(
    (p) => p.status === 'upcoming' || new Date(p.launchDate).getTime() > now
  );

  const handleNotifyMe = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    joinWaitlist(productId);
    setWaitlistSuccessMap((prev) => ({ ...prev, [productId]: true }));
    setTimeout(() => {
      setWaitlistSuccessMap((prev) => ({ ...prev, [productId]: false }));
    }, 3000);
  };

  if (upcomingProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 border-b border-neutral-200/80 dark:border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Launch Radar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Upcoming Launches
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Be the first to test new tools and claim early adopter launch deals.
            </p>
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {upcomingProducts.length} {upcomingProducts.length === 1 ? 'product' : 'products'} on radar
          </div>
        </div>

        {/* Upcoming Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingProducts.map((product) => {
            const countdown = formatCountdown(product.launchDate);
            const isWaitlisted =
              currentUser?.waitlistedProductIds?.includes(product.id) ||
              product.waitlistUsers?.includes(currentUser?.email || '');
            const justJoined = waitlistSuccessMap[product.id];

            return (
              <div
                key={product.id}
                onClick={() => onOpenDetails(product)}
                className="group relative rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#141413]/70 backdrop-blur-xs p-6 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  
                  {/* Left: Product Info */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-2.5 shrink-0">
                      <img
                        src={product.logoUrl}
                        alt={product.name}
                        className="w-full h-full object-contain dark:invert"
                      />
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 truncate group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        <span>{product.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>by {product.maker.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Launch Date Badge */}
                  <div className="text-right shrink-0">
                    <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-1 justify-end">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(product.launchDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                {/* Tagline */}
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-3 line-clamp-2 leading-relaxed">
                  {product.tagline}
                </p>

                {/* Deal note if exists */}
                {product.deal && (
                  <div className="mt-3 text-xs text-amber-700 dark:text-amber-400 font-medium">
                    Waitlist bonus: {product.deal.discountPercent}% off with code {product.deal.code}
                  </div>
                )}

                {/* Live Countdown Clock Bar */}
                <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-850 flex items-center justify-between gap-4">
                  
                  {/* Countdown digits */}
                  <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100 font-mono text-xs tabular-nums">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-semibold">{String(countdown.days).padStart(2, '0')}</span>
                      <span className="text-[10px] text-neutral-400 uppercase">Days</span>
                    </div>
                    <span className="text-neutral-400 mb-2">:</span>
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-semibold">{String(countdown.hours).padStart(2, '0')}</span>
                      <span className="text-[10px] text-neutral-400 uppercase">Hours</span>
                    </div>
                    <span className="text-neutral-400 mb-2">:</span>
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-semibold">{String(countdown.minutes).padStart(2, '0')}</span>
                      <span className="text-[10px] text-neutral-400 uppercase">Mins</span>
                    </div>
                    <span className="text-neutral-400 mb-2">:</span>
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-semibold">{String(countdown.seconds).padStart(2, '0')}</span>
                      <span className="text-[10px] text-neutral-400 uppercase">Secs</span>
                    </div>
                  </div>

                  {/* Notify Me / Waitlist CTA */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:inline">
                      {product.waitlistCount} waiting
                    </span>
                    <button
                      onClick={(e) => handleNotifyMe(e, product.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        isWaitlisted || justJoined
                          ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700'
                          : 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100'
                      }`}
                    >
                      {isWaitlisted || justJoined ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Notified</span>
                        </>
                      ) : (
                        <>
                          <Bell className="w-3.5 h-3.5" />
                          <span>Notify Me</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
