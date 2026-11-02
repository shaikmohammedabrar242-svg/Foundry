import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../services/store';
import {
  X,
  ChevronUp,
  ExternalLink,
  CheckCircle,
  Copy,
  Check,
  Star,
  Eye,
  MousePointer,
  Tag,
  Send,
  MessageSquare,
  BookOpen,
  BarChart3,
  Flame,
  UserCheck,
  UserPlus,
} from 'lucide-react';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenAuth: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onOpenAuth,
}) => {
  const {
    currentUser,
    upvoteProduct,
    trackClick,
    addComment,
    addReview,
    followMaker,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'comments' | 'reviews' | 'updates' | 'analytics'>('overview');
  const [commentInput, setCommentInput] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [copiedDeal, setCopiedDeal] = useState(false);

  if (!product) return null;

  const isUpvoted = currentUser ? product.upvotedBy.includes(currentUser.id) : false;
  const isFollowingMaker = currentUser?.followedMakers?.includes(product.maker?.id);

  // Calculate average rating
  const avgRating =
    product.reviews.length > 0
      ? (
          product.reviews.reduce((sum, r) => sum + r.rating, 0) /
          product.reviews.length
        ).toFixed(1)
      : null;

  const handleUpvote = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    upvoteProduct(product.id);
  };

  const handleVisitWebsite = () => {
    trackClick(product.id, 'website');
    window.open(product.websiteUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyDealCode = () => {
    if (product.deal) {
      navigator.clipboard.writeText(product.deal.code);
      trackClick(product.id, 'deal');
      setCopiedDeal(true);
      setTimeout(() => setCopiedDeal(false), 2500);
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!commentInput.trim()) return;
    addComment(product.id, commentInput);
    setCommentInput('');
  };

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!reviewContent.trim()) return;
    addReview(product.id, reviewRating, reviewTitle, reviewContent);
    setReviewTitle('');
    setReviewContent('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Modal Dialog Container */}
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white dark:bg-[#141413] border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden text-neutral-900 dark:text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-[#141413]/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>Launched {new Date(product.launchDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            {product.isRising && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                  <Flame className="w-3 h-3" />
                  Rising
                </span>
              </>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* Main Title, Logo & Primary Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-3 shrink-0">
                <img
                  src={product.logoUrl}
                  alt={product.name}
                  className="w-full h-full object-contain dark:invert"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {product.name}
                  </h2>
                  {product.isVerified && (
                    <CheckCircle className="w-4 h-4 text-neutral-900 dark:text-neutral-100 shrink-0" />
                  )}
                </div>
                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-1">
                  {product.tagline}
                </p>
              </div>
            </div>

            {/* CTA action cluster */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Upvote button */}
              <button
                onClick={handleUpvote}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  isUpvoted
                    ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white shadow-sm'
                    : 'bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
                }`}
              >
                <ChevronUp className={`w-4 h-4 ${isUpvoted ? 'stroke-[2.5]' : ''}`} />
                <span>Upvote</span>
                <span className="font-mono tabular-nums">{product.upvotes}</span>
              </button>

              {/* Try Free / Visit Website button */}
              <button
                onClick={handleVisitWebsite}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm"
              >
                <span>Visit Website</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Special Discount / Launch Deal Banner */}
          {product.deal && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/20 text-neutral-900 dark:text-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Official Launch Deal · {product.deal.discountPercent}% OFF
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300">
                    {product.deal.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800 bg-white dark:bg-neutral-900 font-mono text-xs font-bold text-neutral-900 dark:text-white">
                  {product.deal.code}
                </div>
                <button
                  onClick={handleCopyDealCode}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity flex items-center gap-1"
                >
                  {copiedDeal ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDeal ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Primary Screenshot / Preview */}
          <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 aspect-[16/9]">
            <img
              src={product.screenshotUrl}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200/80 dark:border-neutral-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2 px-3 rounded-lg text-center transition-colors ${
                activeTab === 'overview'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`flex-1 py-2 px-3 rounded-lg text-center transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'comments'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <span>Discussion</span>
              <span className="font-mono tabular-nums text-[11px] opacity-70">({product.comments.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-2 px-3 rounded-lg text-center transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'reviews'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <span>Reviews</span>
              <span className="font-mono tabular-nums text-[11px] opacity-70">({product.reviews.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('updates')}
              className={`flex-1 py-2 px-3 rounded-lg text-center transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'updates'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <span>Changelog</span>
              <span className="font-mono tabular-nums text-[11px] opacity-70">({product.updates.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 py-2 px-3 rounded-lg text-center transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'analytics'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <span>Attention to Customers</span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Product description & story */}
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    About the product
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>

                {product.story && (
                  <div className="pt-4 border-t border-neutral-100 dark:border-neutral-850">
                    <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                      The Maker's Story
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed italic border-l-2 border-neutral-300 dark:border-neutral-700 pl-4">
                      "{product.story}"
                    </p>
                  </div>
                )}
              </div>

              {/* Maker profile sidebar */}
              <div className="lg:col-span-4 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 space-y-4">
                <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Maker Profile
                </div>

                <div className="flex items-start gap-3">
                  <img
                    src={product.maker.avatar}
                    alt={product.maker.name}
                    className="w-12 h-12 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                        {product.maker.name}
                      </span>
                      {product.isVerified && (
                        <CheckCircle className="w-3.5 h-3.5 text-neutral-900 dark:text-neutral-100" />
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      @{product.maker.handle}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {product.maker.bio}
                </p>

                {/* Maker badges */}
                <div className="flex flex-wrap gap-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                  {product.maker.badges?.map((badge, idx) => (
                    <span key={badge} className="font-medium">
                      {idx > 0 && <span aria-hidden="true" className="mx-1">·</span>}
                      {badge}
                    </span>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => followMaker(product.maker.id)}
                    className={`w-full py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                      isFollowingMaker
                        ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                        : 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90'
                    }`}
                  >
                    {isFollowingMaker ? (
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
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMMENTS / DISCUSSION */}
          {activeTab === 'comments' && (
            <div className="space-y-6">
              {/* Add comment box */}
              <form onSubmit={handlePostComment} className="space-y-3">
                <textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder={
                    currentUser
                      ? `Leave feedback or ask ${product.maker.name} a question...`
                      : 'Sign in to join the discussion...'
                  }
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs sm:text-sm focus:outline-hidden focus:ring-1 focus:ring-neutral-950 dark:focus:ring-white"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity flex items-center gap-1.5"
                  >
                    <Send className="w-3 h-3" />
                    <span>Post Comment</span>
                  </button>
                </div>
              </form>

              {/* Comments list */}
              <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-850">
                {product.comments.length === 0 ? (
                  <p className="text-xs text-neutral-400 py-6 text-center">
                    No comments yet. Start the conversation!
                  </p>
                ) : (
                  product.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-4 rounded-xl border border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-900/30 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <img
                            src={comment.authorAvatar}
                            alt={comment.authorName}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="font-semibold">{comment.authorName}</span>
                          {comment.isMaker && (
                            <span className="text-[10px] font-bold text-neutral-900 dark:text-white bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
                              MAKER
                            </span>
                          )}
                          <span className="text-neutral-400">·</span>
                          <span className="text-neutral-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Average score header */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40">
                <div>
                  <div className="text-xs font-semibold text-neutral-500 uppercase">Community Rating</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-bold font-mono">{avgRating || '5.0'}</span>
                    <div className="flex text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-4 h-4 fill-amber-500" />
                      ))}
                    </div>
                    <span className="text-xs text-neutral-500">({product.reviews.length} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Write Review Form */}
              <form onSubmit={handlePostReview} className="space-y-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">Write a Review</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">Your Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 focus:outline-hidden"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= reviewRating
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-neutral-300 dark:text-neutral-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Review title (e.g. Blazing fast setup)"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-850 focus:outline-hidden"
                />

                <textarea
                  placeholder="Share your experience using this product..."
                  rows={3}
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-850 focus:outline-hidden"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity"
                  >
                    Submit Review
                  </button>
                </div>
              </form>

              {/* Review list */}
              <div className="space-y-4">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl border border-neutral-200/70 dark:border-neutral-800/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={rev.authorAvatar} alt={rev.authorName} className="w-6 h-6 rounded-full" />
                        <span className="text-xs font-semibold">{rev.authorName}</span>
                      </div>
                      <div className="flex text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-500' : 'text-neutral-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="font-semibold text-xs sm:text-sm">{rev.title}</div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">{rev.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CHANGELOG / UPDATES */}
          {activeTab === 'updates' && (
            <div className="space-y-6">
              {product.updates.length === 0 ? (
                <p className="text-xs text-neutral-400 py-6 text-center">
                  No public updates logged yet.
                </p>
              ) : (
                <div className="space-y-6 relative border-l border-neutral-200 dark:border-neutral-800 ml-3 pl-6">
                  {product.updates.map((update) => (
                    <div key={update.id} className="relative space-y-1">
                      <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-neutral-900 dark:bg-white border-2 border-white dark:border-[#141413]" />
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <span className="font-mono">{update.date}</span>
                        {update.version && (
                          <>
                            <span>·</span>
                            <span className="font-mono font-medium">v{update.version}</span>
                          </>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                        {update.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                        {update.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ATTENTION TO CUSTOMERS (LAUNCH ANALYTICS) */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="max-w-xl">
                <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Attention to Customers
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Transparent metrics detailing whether this launch is capturing authentic traction and generating real customer actions.
                </p>
              </div>

              {/* 4 Launch telemetry blocks */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Product Views</span>
                  </div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
                    {product.views}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <MousePointer className="w-3.5 h-3.5" />
                    <span>Website Clicks</span>
                  </div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
                    {product.websiteClicks}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span>Upvotes</span>
                  </div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
                    {product.upvotes}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Deal Activations</span>
                  </div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
                    {product.deal?.dealClicks || 0}
                  </div>
                </div>
              </div>

              {/* Conversion rate insights */}
              <div className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 text-xs space-y-2 text-neutral-600 dark:text-neutral-400">
                <div className="font-semibold text-neutral-900 dark:text-neutral-100">Launch Velocity Calculation:</div>
                <div className="flex items-center justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                  <span>Click-Through Rate (Views → Website)</span>
                  <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                    {product.views > 0 ? ((product.websiteClicks / product.views) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                  <span>Upvote Engagement Rate</span>
                  <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                    {product.views > 0 ? ((product.upvotes / product.views) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span>Deal Claim Conversion</span>
                  <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                    {product.views > 0 && product.deal
                      ? ((product.deal.dealClicks / product.views) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
