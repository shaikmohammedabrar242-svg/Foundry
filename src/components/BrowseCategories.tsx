import React from 'react';
import { ProductCategory, Product } from '../types';
import {
  Sparkles,
  Terminal,
  Zap,
  TrendingUp,
  Layers,
  Activity,
  Workflow,
  Share2,
  Box,
} from 'lucide-react';

interface BrowseCategoriesProps {
  products: Product[];
  selectedCategory: ProductCategory | 'All';
  onSelectCategory: (cat: ProductCategory | 'All') => void;
}

const CATEGORIES: { name: ProductCategory; icon: React.FC<{ className?: string }> }[] = [
  { name: 'AI Tools', icon: Sparkles },
  { name: 'Developer Tools', icon: Terminal },
  { name: 'Productivity', icon: Zap },
  { name: 'Analytics', icon: Activity },
  { name: 'Finance', icon: TrendingUp },
  { name: 'Design', icon: Layers },
  { name: 'Automation', icon: Workflow },
  { name: 'Marketing', icon: Share2 },
  { name: 'Other', icon: Box },
];

export const BrowseCategories: React.FC<BrowseCategoriesProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="py-16 border-b border-neutral-200/80 dark:border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
              Taxonomy
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Browse Categories
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Explore specialized SaaS tools segmented by functional discipline.
            </p>
          </div>

          {selectedCategory !== 'All' && (
            <button
              onClick={() => onSelectCategory('All')}
              className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 underline hover:opacity-80 transition-opacity"
            >
              Reset to All ({products.length})
            </button>
          )}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {CATEGORIES.map(({ name, icon: Icon }) => {
            const count = products.filter((p) => p.category === name).length;
            const isSelected = selectedCategory === name;

            return (
              <button
                key={name}
                onClick={() => onSelectCategory(isSelected ? 'All' : name)}
                className={`text-left p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between h-28 group ${
                  isSelected
                    ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900 shadow-sm'
                    : 'border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-[#141413]/70 hover:border-neutral-400 dark:hover:border-neutral-600'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Icon
                    className={`w-5 h-5 ${
                      isSelected
                        ? 'text-white dark:text-neutral-900'
                        : 'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100'
                    }`}
                  />
                  <span
                    className={`text-xs font-mono tabular-nums ${
                      isSelected ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-400 dark:text-neutral-500'
                    }`}
                  >
                    {count}
                  </span>
                </div>

                <div>
                  <h4
                    className={`text-sm font-semibold truncate ${
                      isSelected ? 'text-white dark:text-neutral-900' : 'text-neutral-900 dark:text-neutral-100'
                    }`}
                  >
                    {name}
                  </h4>
                  <p
                    className={`text-[11px] mt-0.5 truncate ${
                      isSelected ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-500 dark:text-neutral-400'
                    }`}
                  >
                    {count === 1 ? '1 product' : `${count} products`}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
