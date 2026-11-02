import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '../services/store';
import { Sparkles, ArrowRight } from 'lucide-react';

interface LiveStatsSectionProps {
  onLaunchClick: () => void;
}

export const LiveStatsSection: React.FC<LiveStatsSectionProps> = ({ onLaunchClick }) => {
  const { stats } = useStore();
  const [hasEntered, setHasEntered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Animated values
  const [animatedProducts, setAnimatedProducts] = useState(0);
  const [animatedMakers, setAnimatedMakers] = useState(0);
  const [animatedLaunches, setAnimatedLaunches] = useState(0);
  const [animatedVotes, setAnimatedVotes] = useState(0);

  // Viewport intersection observer for subtle count-up animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasEntered(true);
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Run subtle count up when enters viewport or when real numbers update
  useEffect(() => {
    if (!hasEntered) return;

    const duration = 1200; // ms
    const startTime = performance.now();

    const startProducts = 0;
    const startMakers = 0;
    const startLaunches = 0;
    const startVotes = 0;

    const targetProducts = stats.totalProducts;
    const targetMakers = stats.makers;
    const targetLaunches = stats.launches;
    const targetVotes = stats.communityVotes;

    let animationFrameId: number;

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo curve
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setAnimatedProducts(Math.round(startProducts + (targetProducts - startProducts) * ease));
      setAnimatedMakers(Math.round(startMakers + (targetMakers - startMakers) * ease));
      setAnimatedLaunches(Math.round(startLaunches + (targetLaunches - startLaunches) * ease));
      setAnimatedVotes(Math.round(startVotes + (targetVotes - startVotes) * ease));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [hasEntered, stats.totalProducts, stats.makers, stats.launches, stats.communityVotes]);

  return (
    <section
      ref={containerRef}
      className="py-20 sm:py-28 border-t border-b border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-[#111110]/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
            Real-Time Network Activity
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            A growing home for independent makers.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            Transparent metrics synced live with the database. Real software, authentic founders, and genuine community engagement.
          </p>
        </div>

        {/* 4-column responsive grid on desktop, 2-column on mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 py-8 border-y border-neutral-200/60 dark:border-neutral-850">
          
          {/* Stat 1: Total Products */}
          <div className="space-y-2">
            <div className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-neutral-950 dark:text-white font-mono tabular-nums">
              {hasEntered ? animatedProducts : stats.totalProducts}
            </div>
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Total Products
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              Registered SaaS products and startups
            </p>
          </div>

          {/* Stat 2: Makers */}
          <div className="space-y-2">
            <div className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-neutral-950 dark:text-white font-mono tabular-nums">
              {hasEntered ? animatedMakers : stats.makers}
            </div>
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Makers
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              Registered solo founders and engineering teams
            </p>
          </div>

          {/* Stat 3: Launches */}
          <div className="space-y-2">
            <div className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-neutral-950 dark:text-white font-mono tabular-nums">
              {hasEntered ? animatedLaunches : stats.launches}
            </div>
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Launches
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              Products successfully debuted to early adopters
            </p>
          </div>

          {/* Stat 4: Community Votes */}
          <div className="space-y-2">
            <div className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-neutral-950 dark:text-white font-mono tabular-nums">
              {hasEntered ? animatedVotes : stats.communityVotes}
            </div>
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Community Votes
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              Genuine upvotes cast across all products
            </p>
          </div>

        </div>

        {/* Small closing CTA */}
        <div className="mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#141413] border border-neutral-200/80 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join the collective</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Your product belongs here.
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Launch to makers, collect actionable early feedback, and test your pricing model today.
            </p>
          </div>

          <button
            onClick={onLaunchClick}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 shadow-sm"
          >
            <span>Launch Your Product</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
