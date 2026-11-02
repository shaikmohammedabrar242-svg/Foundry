import React, { useState, useMemo } from 'react';
import { useStore } from './services/store';
import { ProductCategory, Product } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductCard } from './components/ProductCard';
import { LaunchRadar } from './components/LaunchRadar';
import { BrowseCategories } from './components/BrowseCategories';
import { WeeklyMakerSpotlight } from './components/WeeklyMakerSpotlight';
import { FaqSection } from './components/FaqSection';
import { LiveStatsSection } from './components/LiveStatsSection';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { SubmitProductModal } from './components/SubmitProductModal';
import { MakerDashboardModal } from './components/MakerDashboardModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { AuthModal } from './components/AuthModal';
import { LegalModal } from './components/LegalModal';
import { CookieBanner } from './components/CookieBanner';
import { SqlSetupModal } from './components/SqlSetupModal';
import { NotFoundPage } from './components/NotFoundPage';
import { Footer } from './components/Footer';
import {
  Search,
  SlidersHorizontal,
  Flame,
  Clock,
  ChevronUp,
  Tag,
  CheckCircle,
  Award,
  Plus,
  List,
  LayoutGrid,
} from 'lucide-react';

export default function App() {
  const { products, trackClick, isSupabaseLive } = useStore();

  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<string>('discover');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'trending' | 'newest' | 'upvoted' | 'deals'>('trending');
  const [filterDealsOnly, setFilterDealsOnly] = useState(false);
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Modal States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [dashboardModalOpen, setDashboardModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [sqlSetupModalOpen, setSqlSetupModalOpen] = useState(false);
  
  // Legal Modal
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalInitialTab, setLegalInitialTab] = useState<'privacy' | 'terms' | 'cookies'>('privacy');

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Status check
        if (p.status === 'rejected') return false;

        // Category filter
        if (selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }

        // Deals filter
        if (filterDealsOnly && !p.deal) {
          return false;
        }

        // Verified maker filter
        if (filterVerifiedOnly && !p.isVerified) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchTagline = p.tagline.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchMaker = p.maker?.name.toLowerCase().includes(q);
          return matchName || matchTagline || matchDesc || matchMaker;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'trending') {
          // Weighted 24-hour engagement scoring: upvotes*3 + views*1 + websiteClicks*2
          const aScore = (a.upvotes || 0) * 3 + (a.views || 0) + (a.websiteClicks || 0) * 2;
          const bScore = (b.upvotes || 0) * 3 + (b.views || 0) + (b.websiteClicks || 0) * 2;
          return bScore - aScore;
        }
        if (sortBy === 'upvoted') {
          return (b.upvotes || 0) - (a.upvotes || 0);
        }
        if (sortBy === 'newest') {
          return new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime();
        }
        if (sortBy === 'deals') {
          const aDiscount = a.deal?.discountPercent || 0;
          const bDiscount = b.deal?.discountPercent || 0;
          return bDiscount - aDiscount;
        }
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy, filterDealsOnly, filterVerifiedOnly]);

  // Featured product (e.g. Velo Analytics or marked as featured)
  const featuredProduct = useMemo(() => {
    return products.find((p) => p.isFeatured && p.status === 'launched') || products[0];
  }, [products]);

  // Today's Launches (launched within recent period or today)
  const todayLaunches = useMemo(() => {
    return filteredProducts.filter((p) => p.status === 'launched').slice(0, 5);
  }, [filteredProducts]);

  // Total Live Outbound Traffic Sent from Foundry to Products
  const totalLiveVisitorsSent = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.websiteClicks || 0), 0);
  }, [products]);

  const handleOpenProductDetails = (product: Product) => {
    trackClick(product.id, 'view');
    setSelectedProduct(product);
  };

  const handleDiscoverClick = () => {
    setCurrentTab('discover');
    const el = document.getElementById('discovery-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenLegal = (tab: 'privacy' | 'terms' | 'cookies') => {
    setLegalInitialTab(tab);
    setLegalModalOpen(true);
  };

  const isKnownTab = ['discover', 'upcoming', 'categories', 'community'].includes(currentTab);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#141413] dark:bg-[#0D0D0C] dark:text-[#ECEBE8] selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900 transition-colors duration-200">
      
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSubmit={() => setSubmitModalOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenDashboard={() => setDashboardModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onOpenSqlSetup={() => setSqlSetupModalOpen(true)}
      />

      <main className="flex-1">
        
        {/* Custom 404 View if invalid route */}
        {!isKnownTab && (
          <NotFoundPage
            onBackToDiscover={() => {
              setCurrentTab('discover');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onReturnHome={() => {
              setCurrentTab('discover');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* TAB 1: DISCOVER / HOMEPAGE */}
        {currentTab === 'discover' && (
          <>
            {/* Hero Section */}
            <HeroSection
              featuredProduct={featuredProduct}
              onDiscoverClick={handleDiscoverClick}
              onLaunchClick={() => setSubmitModalOpen(true)}
              onOpenDetails={handleOpenProductDetails}
            />

            {/* Featured Launch Spotlight (Bento Header) */}
            {featuredProduct && (
              <section className="py-12 border-b border-neutral-200/80 dark:border-neutral-800/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      <span>Spotlight Launch of the Day</span>
                    </div>
                  </div>

                  <ProductCard
                    product={featuredProduct}
                    variant="featured"
                    onOpenDetails={handleOpenProductDetails}
                  />
                </div>
              </section>
            )}

            {/* Product Discovery Search & Filters */}
            <section id="discovery-catalog" className="py-16 border-b border-neutral-200/80 dark:border-neutral-800/80">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Search & Sort Controls Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  
                  {/* Search bar */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Search software by name, tagline, or founder..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white/70 dark:bg-[#141413]/70 backdrop-blur-xs text-xs sm:text-sm focus:outline-hidden focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition-all"
                    />
                  </div>

                  {/* Filter & Sort Controls */}
                  <div className="flex flex-wrap items-center gap-3">
                    
                    {/* Sort Segmented Control */}
                    <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200/60 dark:border-neutral-800 text-xs">
                      <button
                        onClick={() => setSortBy('trending')}
                        className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                          sortBy === 'trending'
                            ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-semibold'
                            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        <Flame className="w-3 h-3 text-amber-500" />
                        <span>Trending</span>
                      </button>

                      <button
                        onClick={() => setSortBy('newest')}
                        className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                          sortBy === 'newest'
                            ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-semibold'
                            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        <span>Newest</span>
                      </button>

                      <button
                        onClick={() => setSortBy('upvoted')}
                        className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                          sortBy === 'upvoted'
                            ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-semibold'
                            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        <ChevronUp className="w-3 h-3" />
                        <span>Upvoted</span>
                      </button>

                      <button
                        onClick={() => setSortBy('deals')}
                        className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                          sortBy === 'deals'
                            ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-semibold'
                            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        <Tag className="w-3 h-3 text-amber-500" />
                        <span>Best Deals</span>
                      </button>
                    </div>

                    {/* Deals toggle */}
                    <button
                      onClick={() => setFilterDealsOnly(!filterDealsOnly)}
                      className={`px-3 py-2 rounded-xl border text-xs font-medium transition-colors flex items-center gap-1.5 ${
                        filterDealsOnly
                          ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white'
                          : 'border-neutral-200/80 dark:border-neutral-800 bg-white/70 dark:bg-[#141413]/70 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      <Tag className="w-3.5 h-3.5" />
                      <span>Deals Only</span>
                    </button>

                    {/* Verified Makers toggle */}
                    <button
                      onClick={() => setFilterVerifiedOnly(!filterVerifiedOnly)}
                      className={`px-3 py-2 rounded-xl border text-xs font-medium transition-colors flex items-center gap-1.5 ${
                        filterVerifiedOnly
                          ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white'
                          : 'border-neutral-200/80 dark:border-neutral-800 bg-white/70 dark:bg-[#141413]/70 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Verified Only</span>
                    </button>

                    {/* View Switcher: TrustMRR List vs Card Grid */}
                    <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200/60 dark:border-neutral-800 text-xs ml-auto">
                      <button
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                          viewMode === 'list'
                            ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-semibold'
                            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                        title="TrustMRR Vertical Line List"
                      >
                        <List className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">TrustMRR List</span>
                      </button>

                      <button
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                          viewMode === 'grid'
                            ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-semibold'
                            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                        title="Card Grid"
                      >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Grid</span>
                      </button>
                    </div>

                  </div>
                </div>

                {/* Category Horizontal Filter Bar */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none text-xs">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategory === 'All'
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold shadow-xs'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-neutral-100/70 dark:bg-neutral-900/70'
                    }`}
                  >
                    All Disciplines
                  </button>

                  {[
                    'AI Tools',
                    'Developer Tools',
                    'Productivity',
                    'Analytics',
                    'Finance',
                    'Design',
                    'Automation',
                    'Marketing',
                    'Other',
                  ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat as ProductCategory)}
                      className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                        selectedCategory === cat
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold shadow-xs'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-neutral-100/70 dark:bg-neutral-900/70'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Section Title & Live Outbound Traffic Indicator */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-8 mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                      {selectedCategory === 'All' ? "Today's Launches & Trending Software" : `${selectedCategory} Launches`}
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} curated by founders
                    </p>
                  </div>

                  {/* Live Outbound Visitors Sent from Foundry Indicator */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-xs text-neutral-800 dark:text-neutral-200 backdrop-blur-xs self-start sm:self-auto">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {totalLiveVisitorsSent.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-neutral-600 dark:text-neutral-400">
                      visitors sent live from our website
                    </span>
                  </div>
                </div>

                {/* Product Catalog Display (TrustMRR Vertical Line List or Card Grid) */}
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 space-y-3">
                    <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                      No products match your current filter.
                    </p>
                    <p className="text-xs text-neutral-400">
                      Try resetting your search query or switching categories.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory('All');
                        setSearchQuery('');
                        setFilterDealsOnly(false);
                        setFilterVerifiedOnly(false);
                      }}
                      className="px-4 py-2 rounded-lg text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : viewMode === 'list' ? (
                  <div className="space-y-3">
                    {filteredProducts.map((product, idx) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        variant="trustmrr-row"
                        rank={idx + 1}
                        onOpenDetails={handleOpenProductDetails}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        variant="standard"
                        onOpenDetails={handleOpenProductDetails}
                      />
                    ))}
                  </div>
                )}

              </div>
            </section>

            {/* Launch Radar / Upcoming Launches with live countdowns */}
            <LaunchRadar
              products={products}
              onOpenDetails={handleOpenProductDetails}
            />

            {/* Browse Categories Section */}
            <BrowseCategories
              products={products}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                const el = document.getElementById('discovery-catalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Weekly Featured Maker Spotlight */}
            <WeeklyMakerSpotlight
              products={products}
              onOpenDetails={handleOpenProductDetails}
            />

            {/* 5 FAQs Section */}
            <FaqSection />

            {/* Live Platform Statistics (Homepage Section 13) */}
            <LiveStatsSection
              onLaunchClick={() => setSubmitModalOpen(true)}
            />
          </>
        )}

        {/* TAB 2: UPCOMING (LAUNCH RADAR DEDICATED VIEW) */}
        {currentTab === 'upcoming' && (
          <div className="py-12">
            <LaunchRadar
              products={products}
              onOpenDetails={handleOpenProductDetails}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
              <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-[#141413]/70 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold">Have an upcoming product in development?</h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Schedule your launch on the radar, build your early waitlist, and collect pre-launch interest.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 whitespace-nowrap"
                >
                  Schedule Your Launch
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORIES VIEW */}
        {currentTab === 'categories' && (
          <div className="py-12">
            <BrowseCategories
              products={products}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">
                  {selectedCategory === 'All' ? 'All Products' : `${selectedCategory} Products`}
                </h3>
                <span className="text-xs text-neutral-500">
                  {filteredProducts.length} available
                </span>
              </div>

              <div className="space-y-3">
                {filteredProducts.map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="trustmrr-row"
                    rank={idx + 1}
                    onOpenDetails={handleOpenProductDetails}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COMMUNITY & MAKER REPUTATION VIEW */}
        {currentTab === 'community' && (
          <div className="py-12 space-y-12">
            <WeeklyMakerSpotlight
              products={products}
              onOpenDetails={handleOpenProductDetails}
            />

            {/* Daily Leaderboard */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl mb-8">
                <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                  Community Hall of Fame
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Daily Launch Leaderboard
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Ranked by authentic community upvotes and verified early customer engagement.
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white/70 dark:bg-[#141413]/70 backdrop-blur-xs overflow-hidden">
                <div className="divide-y divide-neutral-100 dark:divide-neutral-850">
                  {todayLaunches.map((prod, index) => (
                    <div
                      key={prod.id}
                      onClick={() => handleOpenProductDetails(prod)}
                      className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-neutral-50/80 dark:hover:bg-neutral-900/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Rank index */}
                        <span className="text-lg font-bold font-mono text-neutral-400 dark:text-neutral-500 w-6 text-center">
                          {index + 1}
                        </span>

                        <div className="w-10 h-10 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-2 shrink-0">
                          <img src={prod.logoUrl} alt={prod.name} className="w-full h-full object-contain dark:invert" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100 truncate">
                              {prod.name}
                            </span>
                            {prod.deal && (
                              <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                                {prod.deal.discountPercent}% OFF
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                            {prod.tagline}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-neutral-400 hidden sm:inline">
                          by {prod.maker?.name}
                        </span>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-semibold font-mono">
                          <ChevronUp className="w-3.5 h-3.5 text-neutral-500" />
                          <span>{prod.upvotes}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSubmit={() => setSubmitModalOpen(true)}
        onOpenLegal={handleOpenLegal}
        onOpenSqlSetup={() => setSqlSetupModalOpen(true)}
      />

      {/* Cookie Consent Banner */}
      <CookieBanner onOpenLegal={handleOpenLegal} />

      {/* Modals */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <SubmitProductModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        onSuccess={() => {
          setCurrentTab('discover');
        }}
      />

      <MakerDashboardModal
        isOpen={dashboardModalOpen}
        onClose={() => setDashboardModalOpen(false)}
        onOpenSubmit={() => setSubmitModalOpen(true)}
        onOpenProduct={(prod) => setSelectedProduct(prod)}
      />

      <AdminPanelModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalInitialTab}
      />

      <SqlSetupModal
        isOpen={sqlSetupModalOpen}
        onClose={() => setSqlSetupModalOpen(false)}
        isSupabaseLive={isSupabaseLive}
      />

    </div>
  );
}
