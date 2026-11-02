import React, { useState } from 'react';
import { useStore } from '../services/store';
import {
  X,
  Shield,
  Check,
  Ban,
  Star,
  CheckCircle,
  Trash2,
  Calendar,
} from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    products,
    approveProduct,
    rejectProduct,
    toggleFeatureProduct,
    verifyMaker,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'products' | 'makers' | 'schedule'>('products');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  if (!isOpen) return null;

  // Filter products
  const filteredProducts = products.filter((p) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'featured') return p.isFeatured;
    return p.status === filterStatus;
  });

  // Extract unique makers
  const makersMap = new Map();
  products.forEach((p) => {
    if (p.maker?.id && !makersMap.has(p.maker.id)) {
      makersMap.set(p.maker.id, p.maker);
    }
  });
  const allMakers = Array.from(makersMap.values());

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white dark:bg-[#141413] border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden text-neutral-900 dark:text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#141413]/95 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-neutral-900 dark:text-white" />
            <h3 className="text-base font-bold">Admin Curation Console</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close admin panel"
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 py-2.5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'products'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              All Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('makers')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'makers'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              Maker Verification ({allMakers.length})
            </button>
          </div>

          {activeTab === 'products' && (
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-neutral-400">Filter:</span>
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2 py-1 rounded ${filterStatus === 'all' ? 'bg-neutral-200 dark:bg-neutral-800 font-semibold' : ''}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('launched')}
                className={`px-2 py-1 rounded ${filterStatus === 'launched' ? 'bg-neutral-200 dark:bg-neutral-800 font-semibold' : ''}`}
              >
                Launched
              </button>
              <button
                onClick={() => setFilterStatus('upcoming')}
                className={`px-2 py-1 rounded ${filterStatus === 'upcoming' ? 'bg-neutral-200 dark:bg-neutral-800 font-semibold' : ''}`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilterStatus('featured')}
                className={`px-2 py-1 rounded ${filterStatus === 'featured' ? 'bg-neutral-200 dark:bg-neutral-800 font-semibold' : ''}`}
              >
                Featured
              </button>
            </div>
          )}
        </div>

        {/* Scrollable list */}
        <div className="overflow-y-auto p-6 space-y-4">
          
          {/* TAB 1: PRODUCTS CURATION */}
          {activeTab === 'products' && (
            <div className="space-y-3">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/30"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <img src={p.logoUrl} alt={p.name} className="w-8 h-8 rounded-lg object-contain dark:invert shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm truncate">{p.name}</span>
                        {p.isFeatured && (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 px-1.5 py-0.5 rounded">
                            FEATURED
                          </span>
                        )}
                        <span className="text-[11px] text-neutral-400 capitalize">· {p.status}</span>
                      </div>
                      <p className="text-xs text-neutral-500 truncate">{p.tagline}</p>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-1">
                        <span>{p.category}</span>
                        <span>·</span>
                        <span>by {p.maker?.name}</span>
                        <span>·</span>
                        <span>{p.upvotes} upvotes</span>
                        <span>·</span>
                        <span>{p.views} views</span>
                      </div>
                    </div>
                  </div>

                  {/* Admin action buttons */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => toggleFeatureProduct(p.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1 transition-colors ${
                        p.isFeatured
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                      }`}
                    >
                      <Star className="w-3 h-3 fill-current" />
                      <span>{p.isFeatured ? 'Featured' : 'Feature'}</span>
                    </button>

                    {p.status !== 'launched' && (
                      <button
                        onClick={() => approveProduct(p.id)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Approve</span>
                      </button>
                    )}

                    {p.status !== 'rejected' && (
                      <button
                        onClick={() => rejectProduct(p.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        title="Reject / Flag as spam"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: MAKERS VERIFICATION */}
          {activeTab === 'makers' && (
            <div className="space-y-3">
              {allMakers.map((maker) => {
                const isVerified = maker.badges?.includes('Verified Maker');
                return (
                  <div
                    key={maker.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/30"
                  >
                    <div className="flex items-center gap-3">
                      <img src={maker.avatar} alt={maker.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm">{maker.name}</span>
                          {isVerified && (
                            <CheckCircle className="w-3.5 h-3.5 text-neutral-900 dark:text-neutral-100" />
                          )}
                        </div>
                        <p className="text-xs text-neutral-500">@{maker.handle}</p>
                      </div>
                    </div>

                    <div>
                      {isVerified ? (
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => verifyMaker(maker.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90"
                        >
                          Grant Verified Badge
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
