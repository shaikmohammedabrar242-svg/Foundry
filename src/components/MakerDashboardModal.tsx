import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../services/store';
import {
  X,
  Briefcase,
  Plus,
  Eye,
  MousePointer,
  ChevronUp,
  Tag,
  CheckCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  Send,
  Edit3,
} from 'lucide-react';

interface MakerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSubmit: () => void;
  onOpenProduct: (product: Product) => void;
}

export const MakerDashboardModal: React.FC<MakerDashboardModalProps> = ({
  isOpen,
  onClose,
  onOpenSubmit,
  onOpenProduct,
}) => {
  const {
    products,
    currentUser,
    addProductUpdate,
    updateProduct,
    verifyMaker,
  } = useStore();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateContent, setUpdateContent] = useState('');
  const [updateVersion, setUpdateVersion] = useState('');
  
  // Verification domain state
  const [domainEmail, setDomainEmail] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  // Edit deal state
  const [editingDeal, setEditingDeal] = useState(false);
  const [dealPercent, setDealPercent] = useState(30);
  const [dealCode, setDealCode] = useState('');

  if (!isOpen) return null;

  // Filter products belonging to current user
  const userProducts = products.filter(
    (p) => p.maker?.id === currentUser?.id || p.maker?.handle === currentUser?.handle
  );

  const activeProduct = selectedProduct || userProducts[0] || products[0];

  const handlePostUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProduct || !updateTitle.trim() || !updateContent.trim()) return;
    addProductUpdate(activeProduct.id, updateTitle, updateContent, updateVersion);
    setUpdateTitle('');
    setUpdateContent('');
    setUpdateVersion('');
  };

  const handleSaveDeal = () => {
    if (!activeProduct) return;
    updateProduct(activeProduct.id, {
      deal: {
        discountPercent: Number(dealPercent),
        code: dealCode.toUpperCase(),
        description: `${dealPercent}% off for early adopters`,
        dealClicks: activeProduct.deal?.dealClicks || 0,
      },
    });
    setEditingDeal(false);
  };

  const handleVerifyOwnership = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainEmail.trim() || !domainEmail.includes('@')) return;
    if (currentUser) {
      verifyMaker(currentUser.id);
    }
    setVerificationSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white dark:bg-[#141413] border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden text-neutral-900 dark:text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#141413]/95 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-neutral-900 dark:text-white" />
            <h3 className="text-base font-bold">Maker Dashboard</h3>
            <span className="text-xs text-neutral-500">· {currentUser?.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenSubmit();
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit New Product</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close dashboard"
              className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* Ownership Verification Banner */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Maker Verification</span>
                    {currentUser?.badges?.includes('Verified Maker') ? (
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Verified Account
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                        Unverified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                    {currentUser?.badges?.includes('Verified Maker')
                      ? 'Your ownership badge is active and displayed alongside your launches.'
                      : 'Verify ownership using your product domain email (e.g. founder@yourproduct.com).'}
                  </p>
                </div>
              </div>

              {!currentUser?.badges?.includes('Verified Maker') && (
                <form onSubmit={handleVerifyOwnership} className="flex items-center gap-2">
                  <input
                    type="email"
                    required
                    placeholder="founder@yourproduct.com"
                    value={domainEmail}
                    onChange={(e) => setDomainEmail(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 whitespace-nowrap"
                  >
                    Verify
                  </button>
                </form>
              )}
            </div>
            {verificationSuccess && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                Domain successfully verified! The "Verified Maker" badge has been awarded.
              </p>
            )}
          </div>

          {/* Product Selector Bar */}
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
              Select Product to Manage
            </div>
            <div className="flex flex-wrap gap-2">
              {userProducts.length === 0 ? (
                <div className="text-xs text-neutral-500">
                  You haven't launched a product yet. Click "Submit New Product" to launch!
                </div>
              ) : (
                userProducts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-medium transition-colors ${
                      activeProduct?.id === p.id
                        ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900 font-semibold'
                        : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                    }`}
                  >
                    <img src={p.logoUrl} alt={p.name} className="w-4 h-4 object-contain dark:invert" />
                    <span>{p.name}</span>
                    <span className="font-mono opacity-70">({p.upvotes} upvotes)</span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Active Product Analytics & Controls */}
          {activeProduct && (
            <div className="space-y-6 pt-4 border-t border-neutral-100 dark:border-neutral-850">
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold">{activeProduct.name} Analytics</h4>
                  <p className="text-xs text-neutral-500">{activeProduct.tagline}</p>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onOpenProduct(activeProduct);
                  }}
                  className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 underline"
                >
                  View Public Page →
                </button>
              </div>

              {/* 4 Analytics metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Total Views</span>
                  </div>
                  <div className="text-2xl font-bold font-mono">{activeProduct.views}</div>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1">
                    <MousePointer className="w-3.5 h-3.5" />
                    <span>Website Clicks</span>
                  </div>
                  <div className="text-2xl font-bold font-mono">{activeProduct.websiteClicks}</div>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1">
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span>Upvotes</span>
                  </div>
                  <div className="text-2xl font-bold font-mono">{activeProduct.upvotes}</div>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Deal Clicks</span>
                  </div>
                  <div className="text-2xl font-bold font-mono">{activeProduct.deal?.dealClicks || 0}</div>
                </div>
              </div>

              {/* Launch Deal Management */}
              <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold uppercase tracking-wider">Launch Deal Management</span>
                  </div>
                  <button
                    onClick={() => {
                      if (!editingDeal) {
                        setDealPercent(activeProduct.deal?.discountPercent || 30);
                        setDealCode(activeProduct.deal?.code || 'LAUNCH30');
                      }
                      setEditingDeal(!editingDeal);
                    }}
                    className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{editingDeal ? 'Cancel' : 'Edit Deal'}</span>
                  </button>
                </div>

                {editingDeal ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] text-neutral-500 mb-1">Discount %</label>
                      <input
                        type="number"
                        value={dealPercent}
                        onChange={(e) => setDealPercent(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-500 mb-1">Code</label>
                      <input
                        type="text"
                        value={dealCode}
                        onChange={(e) => setDealCode(e.target.value.toUpperCase())}
                        className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono uppercase"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={handleSaveDeal}
                        className="w-full py-2 rounded-lg text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                      >
                        Save Deal
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    {activeProduct.deal ? (
                      <>Active offer: <span className="font-bold text-neutral-900 dark:text-neutral-100">{activeProduct.deal.discountPercent}% OFF</span> using coupon <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{activeProduct.deal.code}</span> ({activeProduct.deal.dealClicks} activations).</>
                    ) : (
                      'No active launch deal for this product. Click "Edit Deal" to add an exclusive discount.'
                    )}
                  </p>
                )}
              </div>

              {/* Publish Product Update Form */}
              <form onSubmit={handlePostUpdate} className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider">Publish Product Update</div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="Update title (e.g. Added Webhooks & API Keys)"
                      value={updateTitle}
                      onChange={(e) => setUpdateTitle(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Version (optional, e.g. 1.2.0)"
                      value={updateVersion}
                      onChange={(e) => setUpdateVersion(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono"
                    />
                  </div>
                </div>

                <textarea
                  rows={2}
                  required
                  placeholder="Detail what changed, bug fixes, or new features added in this release..."
                  value={updateContent}
                  onChange={(e) => setUpdateContent(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 flex items-center gap-1.5"
                  >
                    <Send className="w-3 h-3" />
                    <span>Publish Update</span>
                  </button>
                </div>
              </form>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
