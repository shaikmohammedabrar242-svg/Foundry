import React from 'react';
import { Product } from '../types';
import { useStore } from '../services/store';
import { Award, CheckCircle, Flame, UserPlus, UserCheck, ArrowUpRight } from 'lucide-react';

interface WeeklyMakerSpotlightProps {
  products: Product[];
  onOpenDetails: (product: Product) => void;
}

export const WeeklyMakerSpotlight: React.FC<WeeklyMakerSpotlightProps> = ({
  products,
  onOpenDetails,
}) => {
  const { currentUser, followMaker } = useStore();

  // Find featured maker: Felix Vance or maker with most products/upvotes
  const featuredMaker = {
    id: 'mkr_felix_v',
    name: 'Felix Vance',
    handle: 'felixvance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Full-stack builder crafting lightweight micro-SaaS. Built Velo Analytics, PromptLoom, and dev tools. Passionate about speed, privacy, and minimalist software architecture.',
    badges: ['Verified Maker', 'Serial Builder', 'Community Favourite'] as const,
    streakCount: 4,
    website: 'https://felixvance.dev',
    twitter: 'felixvance',
  };

  const isFollowing = currentUser?.followedMakers?.includes(featuredMaker.id);

  // Maker's products on the platform
  const makerProducts = products.filter((p) => p.maker?.id === featuredMaker.id);

  const handleFollow = () => {
    followMaker(featuredMaker.id);
  };

  return (
    <section className="py-16 border-b border-neutral-200/80 dark:border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Maker Reputation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Weekly Featured Maker
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Spotlighting creators who consistently build, launch, and support independent software.
          </p>
        </div>

        {/* Featured Maker Card */}
        <div className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white/70 dark:bg-[#141413]/70 backdrop-blur-xs p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Maker Bio & Badges */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={featuredMaker.avatar}
                  alt={featuredMaker.name}
                  className="w-16 h-16 rounded-full object-cover border border-neutral-200 dark:border-neutral-700 shadow-sm"
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                      {featuredMaker.name}
                    </h3>
                    <CheckCircle className="w-4 h-4 text-neutral-900 dark:text-neutral-100 shrink-0" />
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    @{featuredMaker.handle} · Maker Streak: {featuredMaker.streakCount} launches
                  </p>

                  {/* Clean unboxed badges */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 mt-2">
                    {featuredMaker.badges.map((badge, idx) => (
                      <span key={badge} className="inline-flex items-center gap-1 font-medium">
                        {idx > 0 && <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>}
                        {badge === 'Serial Builder' && <Flame className="w-3 h-3 text-amber-500" />}
                        <span>{badge}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {featuredMaker.bio}
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={handleFollow}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isFollowing
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700'
                      : 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Following Maker</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Follow Maker</span>
                    </>
                  )}
                </button>

                <a
                  href={featuredMaker.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 border border-neutral-200 dark:border-neutral-800 transition-colors"
                >
                  <span>Website</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Right: Maker's products showcase */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Products by {featuredMaker.name}
              </div>

              <div className="space-y-2.5">
                {makerProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => onOpenDetails(prod)}
                    className="flex items-center justify-between p-3 rounded-xl border border-neutral-200/70 dark:border-neutral-800/70 bg-neutral-50/50 dark:bg-neutral-900/50 hover:border-neutral-400 dark:hover:border-neutral-600 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-center p-1.5 shrink-0">
                        <img
                          src={prod.logoUrl}
                          alt={prod.name}
                          className="w-full h-full object-contain dark:invert"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                          {prod.name}
                        </h4>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                          {prod.category} · {prod.upvotes} upvotes
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 shrink-0 ml-2">
                      View →
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
