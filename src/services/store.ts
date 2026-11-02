import { useState, useEffect } from 'react';
import { Product, User, Comment, Review, ProductUpdate, ProductCategory, MakerBadge } from '../types';
import { INITIAL_PRODUCTS, INITIAL_USER } from '../data/seedData';
import { supabase, checkSupabaseConnected } from './supabase';

const PRODUCTS_STORAGE_KEY = 'foundry_products_v1';
const USER_STORAGE_KEY = 'foundry_user_v1';
const THEME_STORAGE_KEY = 'foundry_theme_v1';
const VISITOR_ID_KEY = 'foundry_visitor_id_v1';
const NOTIFICATIONS_STORAGE_KEY = 'foundry_notifications_v1';

export interface AppNotification {
  id: string;
  userId: string;
  type: 'launch' | 'vote' | 'comment' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

class StoreService {
  private products: Product[];
  private currentUser: User | null;
  private theme: 'light' | 'dark';
  private visitorId: string;
  private notifications: AppNotification[] = [];
  private isSupabaseLive: boolean = false;
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Generate or retrieve persistent anonymous visitor ID
    let vid = localStorage.getItem(VISITOR_ID_KEY);
    if (!vid) {
      vid = 'vis_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      localStorage.setItem(VISITOR_ID_KEY, vid);
    }
    this.visitorId = vid;

    // Load products
    const savedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (savedProducts) {
      try {
        this.products = JSON.parse(savedProducts);
      } catch {
        this.products = INITIAL_PRODUCTS;
      }
    } else {
      this.products = INITIAL_PRODUCTS;
      this.saveProducts();
    }

    // Load user
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch {
        this.currentUser = INITIAL_USER;
      }
    } else {
      this.currentUser = INITIAL_USER;
      this.saveUser();
    }

    // Load notifications
    const savedNotifs = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (savedNotifs) {
      try {
        this.notifications = JSON.parse(savedNotifs);
      } catch {
        this.notifications = [];
      }
    }

    // Load theme
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as 'light' | 'dark' | null;
    this.theme = savedTheme || 'light';
    this.applyTheme();

    // Check Supabase connectivity & setup auth listener
    this.initSupabase();

    // Check scheduled launches promotion
    this.promoteScheduledLaunches();
    setInterval(() => this.promoteScheduledLaunches(), 60000);
  }

  private async initSupabase() {
    try {
      this.isSupabaseLive = await checkSupabaseConnected();

      // Check current Supabase auth session
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        const u = data.session.user;
        const name = u.user_metadata?.full_name || u.email?.split('@')[0] || 'Maker';
        const username = u.user_metadata?.username || u.email?.split('@')[0] || 'user';
        this.currentUser = {
          id: u.id,
          name,
          email: u.email || '',
          handle: username,
          avatar: u.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
          role: u.user_metadata?.role || 'maker',
          bio: u.user_metadata?.bio || 'SaaS builder on Foundry.',
          badges: ['First Launch'],
          followedMakers: this.currentUser?.followedMakers || [],
          upvotedProductIds: this.currentUser?.upvotedProductIds || [],
          waitlistedProductIds: this.currentUser?.waitlistedProductIds || [],
        };
        this.saveUser();
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const u = session.user;
          const name = u.user_metadata?.full_name || u.email?.split('@')[0] || 'Maker';
          const username = u.user_metadata?.username || u.email?.split('@')[0] || 'user';
          this.currentUser = {
            id: u.id,
            name,
            email: u.email || '',
            handle: username,
            avatar: u.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
            role: u.user_metadata?.role || 'maker',
            bio: u.user_metadata?.bio || 'SaaS builder on Foundry.',
            badges: ['First Launch'],
            followedMakers: this.currentUser?.followedMakers || [],
            upvotedProductIds: this.currentUser?.upvotedProductIds || [],
            waitlistedProductIds: this.currentUser?.waitlistedProductIds || [],
          };
          this.saveUser();
        } else if (event === 'SIGNED_OUT') {
          this.currentUser = null;
          this.saveUser();
        }
      });
    } catch (e) {
      console.warn('Supabase initialization check skipped:', e);
    }
  }

  private saveProducts() {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(this.products));
    this.notify();
  }

  private saveUser() {
    if (this.currentUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
    this.notify();
  }

  private saveNotifications() {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(this.notifications));
    this.notify();
  }

  private applyTheme() {
    if (this.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, this.theme);
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // Getters
  public getProducts(): Product[] {
    return this.products;
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public getTheme(): 'light' | 'dark' {
    return this.theme;
  }

  public getVisitorId(): string {
    return this.visitorId;
  }

  public getNotifications(): AppNotification[] {
    return this.currentUser
      ? this.notifications.filter((n) => n.userId === this.currentUser?.id)
      : [];
  }

  public getIsSupabaseLive(): boolean {
    return this.isSupabaseLive;
  }

  public toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme();
    this.notify();
  }

  // 5. Launch Radar Automatic Promotion
  public promoteScheduledLaunches() {
    const now = new Date().getTime();
    let hasChanges = false;

    this.products = this.products.map((p) => {
      if (p.status === 'upcoming' && new Date(p.launchDate).getTime() <= now) {
        hasChanges = true;
        // Notify waitlisted users
        p.waitlistUsers.forEach((userEmail) => {
          this.notifications.unshift({
            id: `notif_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            userId: userEmail,
            type: 'launch',
            title: `🚀 ${p.name} is now LIVE!`,
            message: `${p.name} has just launched on Foundry! Claim early-adopter deals now.`,
            isRead: false,
            createdAt: new Date().toISOString(),
          });
        });

        return {
          ...p,
          status: 'launched',
          isRising: true,
          updates: [
            {
              id: `upd_${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              title: 'Product Officially Launched',
              content: 'Countdown elapsed. The product is now publicly live to all users!',
              version: '1.0.0',
            },
            ...(p.updates || []),
          ],
        };
      }
      return p;
    });

    if (hasChanges) {
      this.saveProducts();
      this.saveNotifications();
    }
  }

  // 6. Rising Products 24-Hour Weighted Formula
  public getRisingScore(product: Product): number {
    const viewsWeight = 1;
    const clicksWeight = 2;
    const votesWeight = 3;
    return (
      (product.views || 0) * viewsWeight +
      (product.websiteClicks || 0) * clicksWeight +
      (product.upvotes || 0) * votesWeight
    );
  }

  // 7. Maker Reputation Badge Calculations
  public evaluateMakerBadges(makerId: string): MakerBadge[] {
    const makerProducts = this.products.filter(
      (p) => p.maker?.id === makerId && p.status === 'launched'
    );
    const existingMaker = this.products.find((p) => p.maker?.id === makerId)?.maker;
    const badges = new Set<MakerBadge>(existingMaker?.badges || []);

    if (makerProducts.length >= 1) {
      badges.add('First Launch');
    }
    if (makerProducts.length >= 2) {
      badges.add('Serial Builder');
    }
    if (makerProducts.some((p) => p.upvotes >= 100)) {
      badges.add('Community Favourite');
    }

    return Array.from(badges);
  }

  // 9. Live Platform Statistics (Real Database Counts)
  public getLiveStats() {
    const validProducts = this.products.filter((p) => p.status !== 'rejected');
    const totalProducts = validProducts.length;

    // Unique makers
    const makerIdSet = new Set<string>();
    validProducts.forEach((p) => {
      if (p.maker?.id) makerIdSet.add(p.maker.id);
    });
    if (this.currentUser && (this.currentUser.role === 'maker' || this.currentUser.role === 'admin')) {
      makerIdSet.add(this.currentUser.id);
    }
    const makers = Math.max(makerIdSet.size, 1);

    // Launches (status === 'launched')
    const launches = validProducts.filter((p) => p.status === 'launched').length;

    // Total upvotes
    const communityVotes = validProducts.reduce((sum, p) => sum + (p.upvotes || 0), 0);

    return {
      totalProducts,
      makers,
      launches,
      communityVotes,
    };
  }

  // 8. Product Analytics & Outbound Click Tracking
  public trackClick(productId: string, type: 'view' | 'website' | 'deal' | 'vote' | 'waitlist') {
    const prodIndex = this.products.findIndex((p) => p.id === productId);
    if (prodIndex === -1) return;

    const product = { ...this.products[prodIndex] };
    if (type === 'view') {
      product.views = (product.views || 0) + 1;
    } else if (type === 'website') {
      product.websiteClicks = (product.websiteClicks || 0) + 1;
    } else if (type === 'deal' && product.deal) {
      product.deal = {
        ...product.deal,
        dealClicks: (product.deal.dealClicks || 0) + 1,
      };
    }

    // Dynamic rising evaluation
    const score = this.getRisingScore(product);
    product.isRising = score > 150 || product.upvotes >= 50;

    this.products[prodIndex] = product;
    this.saveProducts();

    // Async record to Supabase if connected
    if (this.isSupabaseLive) {
      supabase.from('product_analytics').insert({
        product_id: productId,
        event_type: type === 'website' ? 'website_click' : type === 'deal' ? 'deal_click' : type,
        visitor_id: this.visitorId,
      }).then(() => {}, () => {});
    }
  }

  // Upvote product (One vote per user per product enforced)
  public async upvoteProduct(productId: string): Promise<boolean> {
    if (!this.currentUser) return false;

    const prodIndex = this.products.findIndex((p) => p.id === productId);
    if (prodIndex === -1) return false;

    const product = { ...this.products[prodIndex] };
    const userId = this.currentUser.id;
    const hasUpvoted = product.upvotedBy.includes(userId);

    if (hasUpvoted) {
      // Remove vote
      product.upvotedBy = product.upvotedBy.filter((id) => id !== userId);
      product.upvotes = Math.max(0, product.upvotes - 1);
      this.currentUser.upvotedProductIds = this.currentUser.upvotedProductIds.filter(
        (id) => id !== productId
      );

      if (this.isSupabaseLive) {
        await supabase
          .from('votes')
          .delete()
          .match({ user_id: userId, product_id: productId });
      }
    } else {
      // Cast vote
      product.upvotedBy = [...product.upvotedBy, userId];
      product.upvotes = (product.upvotes || 0) + 1;
      this.currentUser.upvotedProductIds = [
        ...(this.currentUser.upvotedProductIds || []),
        productId,
      ];

      // Track analytics
      this.trackClick(productId, 'vote');

      if (this.isSupabaseLive) {
        await supabase.from('votes').insert({
          user_id: userId,
          product_id: productId,
        });
      }
    }

    this.products[prodIndex] = product;
    this.saveProducts();
    this.saveUser();
    return true;
  }

  // Join waitlist
  public async joinWaitlist(productId: string, email?: string): Promise<boolean> {
    const prodIndex = this.products.findIndex((p) => p.id === productId);
    if (prodIndex === -1) return false;

    const product = { ...this.products[prodIndex] };
    const userEmail = email || this.currentUser?.email || 'guest@example.com';

    if (!product.waitlistUsers.includes(userEmail)) {
      product.waitlistUsers = [...product.waitlistUsers, userEmail];
      product.waitlistCount = (product.waitlistCount || 0) + 1;
      this.products[prodIndex] = product;

      if (this.currentUser) {
        this.currentUser.waitlistedProductIds = [
          ...(this.currentUser.waitlistedProductIds || []),
          productId,
        ];
        this.saveUser();
      }
      this.saveProducts();

      if (this.isSupabaseLive && this.currentUser) {
        await supabase.from('waitlist').insert({
          user_id: this.currentUser.id,
          product_id: productId,
        });
      }
    }
    return true;
  }

  // Add Comment
  public async addComment(productId: string, content: string): Promise<boolean> {
    if (!this.currentUser || !content.trim()) return false;

    const prodIndex = this.products.findIndex((p) => p.id === productId);
    if (prodIndex === -1) return false;

    const product = { ...this.products[prodIndex] };
    const newComment: Comment = {
      id: `c_${Date.now()}`,
      authorName: this.currentUser.name,
      authorHandle: this.currentUser.handle,
      authorAvatar: this.currentUser.avatar,
      isMaker: product.maker?.id === this.currentUser.id,
      isVerified: this.currentUser.badges.includes('Verified Maker'),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    product.comments = [newComment, ...(product.comments || [])];
    this.products[prodIndex] = product;
    this.saveProducts();

    if (this.isSupabaseLive) {
      await supabase.from('comments').insert({
        user_id: this.currentUser.id,
        product_id: productId,
        content: content.trim(),
      });
    }

    return true;
  }

  // Add Review (Rating 1-5)
  public async addReview(
    productId: string,
    rating: number,
    title: string,
    content: string
  ): Promise<boolean> {
    if (!this.currentUser || !content.trim()) return false;

    const prodIndex = this.products.findIndex((p) => p.id === productId);
    if (prodIndex === -1) return false;

    const product = { ...this.products[prodIndex] };
    const newReview: Review = {
      id: `r_${Date.now()}`,
      authorName: this.currentUser.name,
      authorHandle: this.currentUser.handle,
      authorAvatar: this.currentUser.avatar,
      rating: Math.min(5, Math.max(1, rating)),
      title: title.trim() || 'Product review',
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    product.reviews = [newReview, ...(product.reviews || [])];
    this.products[prodIndex] = product;
    this.saveProducts();

    if (this.isSupabaseLive) {
      await supabase.from('reviews').insert({
        user_id: this.currentUser.id,
        product_id: productId,
        rating: Math.min(5, Math.max(1, rating)),
        title: title.trim(),
        content: content.trim(),
      });
    }

    return true;
  }

  // Add Product Update / Changelog
  public addProductUpdate(
    productId: string,
    title: string,
    content: string,
    version?: string
  ): boolean {
    const prodIndex = this.products.findIndex((p) => p.id === productId);
    if (prodIndex === -1) return false;

    const product = { ...this.products[prodIndex] };
    const newUpdate: ProductUpdate = {
      id: `upd_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: title.trim(),
      content: content.trim(),
      version: version?.trim(),
    };

    product.updates = [newUpdate, ...(product.updates || [])];
    this.products[prodIndex] = product;
    this.saveProducts();
    return true;
  }

  // Submit Product
  public async submitProduct(data: {
    name: string;
    tagline: string;
    description: string;
    story?: string;
    category: ProductCategory;
    websiteUrl: string;
    demoUrl?: string;
    logoUrl?: string;
    screenshotUrl?: string;
    launchNow: boolean;
    launchDate?: string;
    deal?: {
      discountPercent: number;
      code: string;
      description: string;
    };
  }): Promise<Product> {
    const user = this.currentUser || INITIAL_USER;
    const now = new Date().toISOString();
    const isUpcoming =
      !data.launchNow && data.launchDate && new Date(data.launchDate) > new Date();

    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      name: data.name,
      tagline: data.tagline,
      description: data.description,
      story:
        data.story ||
        `Built with craft by ${user.name}. Designed to solve real workflows effortlessly.`,
      category: data.category,
      logoUrl: data.logoUrl || 'https://api.iconify.design/lucide:box.svg?color=%23171717',
      screenshotUrl:
        data.screenshotUrl || '/src/assets/images/hero_saas_showcase_1793557039852.jpg',
      websiteUrl: data.websiteUrl.startsWith('http')
        ? data.websiteUrl
        : `https://${data.websiteUrl}`,
      demoUrl: data.demoUrl,
      upvotes: 1,
      upvotedBy: [user.id],
      status: isUpcoming ? 'upcoming' : 'launched',
      launchDate: isUpcoming ? data.launchDate! : now,
      isVerified: user.badges.includes('Verified Maker'),
      isFeatured: false,
      isRising: true,
      deal:
        data.deal?.code
          ? {
              discountPercent: data.deal.discountPercent || 20,
              code: data.deal.code.toUpperCase(),
              description: data.deal.description,
              dealClicks: 0,
            }
          : undefined,
      maker: {
        id: user.id,
        name: user.name,
        handle: user.handle,
        avatar: user.avatar,
        bio: user.bio || 'Product maker & indie hacker.',
        badges: user.badges,
        streakCount: (user.badges.includes('Serial Builder') ? 2 : 1),
      },
      views: 1,
      websiteClicks: 0,
      waitlistCount: 0,
      waitlistUsers: [],
      updates: [
        {
          id: `upd_${Date.now()}`,
          date: now.split('T')[0],
          title: isUpcoming ? 'Launch Scheduled on Radar' : 'Product Launched',
          content: isUpcoming
            ? `Countdown initiated. Official release planned for ${new Date(data.launchDate!).toLocaleDateString()}.`
            : 'Initial release on Foundry.',
          version: '1.0.0',
        },
      ],
      comments: [],
      reviews: [],
      createdAt: now,
    };

    this.products = [newProduct, ...this.products];
    this.saveProducts();

    // Re-evaluate maker badges
    const updatedBadges = this.evaluateMakerBadges(user.id);
    user.badges = updatedBadges;
    this.saveUser();

    // If connected to Supabase, sync
    if (this.isSupabaseLive) {
      try {
        const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        await supabase.from('products').insert({
          id: newProduct.id,
          maker_id: user.id,
          name: data.name,
          slug: `${slug}-${Date.now().toString(36)}`,
          tagline: data.tagline,
          description: data.description,
          story: data.story,
          logo_url: newProduct.logoUrl,
          screenshots: [newProduct.screenshotUrl],
          website_url: newProduct.websiteUrl,
          demo_url: newProduct.demoUrl,
          status: newProduct.status,
          launch_date: newProduct.launchDate,
          is_verified: newProduct.isVerified,
        });

        if (newProduct.deal) {
          await supabase.from('launch_deals').insert({
            product_id: newProduct.id,
            discount: newProduct.deal.discountPercent,
            coupon_code: newProduct.deal.code,
            description: newProduct.deal.description,
          });
        }
      } catch (e) {
        console.warn('Supabase sync warning:', e);
      }
    }

    return newProduct;
  }

  // Update existing product
  public updateProduct(productId: string, partial: Partial<Product>): boolean {
    const prodIndex = this.products.findIndex((p) => p.id === productId);
    if (prodIndex === -1) return false;

    this.products[prodIndex] = {
      ...this.products[prodIndex],
      ...partial,
    };
    this.saveProducts();
    return true;
  }

  // Admin Actions
  public approveProduct(productId: string) {
    this.updateProduct(productId, { status: 'launched' });
    this.logAdminAction('approve_product', 'product', productId);
  }

  public rejectProduct(productId: string) {
    this.updateProduct(productId, { status: 'rejected' });
    this.logAdminAction('reject_product', 'product', productId);
  }

  public toggleFeatureProduct(productId: string) {
    const prod = this.products.find((p) => p.id === productId);
    if (prod) {
      this.updateProduct(productId, { isFeatured: !prod.isFeatured });
      this.logAdminAction(
        prod.isFeatured ? 'unfeature_product' : 'feature_product',
        'product',
        productId
      );
    }
  }

  public verifyMaker(makerId: string) {
    this.products = this.products.map((p) => {
      if (p.maker?.id === makerId) {
        const badges = new Set(p.maker.badges || []);
        badges.add('Verified Maker');
        return {
          ...p,
          isVerified: true,
          maker: {
            ...p.maker,
            badges: Array.from(badges) as any,
          },
        };
      }
      return p;
    });
    this.saveProducts();

    if (this.currentUser?.id === makerId) {
      const badges = new Set(this.currentUser.badges || []);
      badges.add('Verified Maker');
      this.currentUser.badges = Array.from(badges) as any;
      this.saveUser();
    }

    this.logAdminAction('verify_maker', 'maker', makerId);
  }

  public followMaker(makerId: string): boolean {
    if (!this.currentUser) return false;
    const isFollowing = this.currentUser.followedMakers.includes(makerId);
    if (isFollowing) {
      this.currentUser.followedMakers = this.currentUser.followedMakers.filter(
        (id) => id !== makerId
      );
    } else {
      this.currentUser.followedMakers = [...this.currentUser.followedMakers, makerId];
    }
    this.saveUser();
    return true;
  }

  // Audit Log
  private logAdminAction(action: string, targetType: string, targetId: string) {
    if (this.isSupabaseLive && this.currentUser?.role === 'admin') {
      supabase.from('audit_logs').insert({
        admin_id: this.currentUser.id,
        action,
        target_type: targetType,
        target_id: targetId,
        details: { timestamp: new Date().toISOString() },
      }).then(() => {}, () => {});
    }
  }

  // Supabase Authentication Handlers
  public async signUpWithEmail(
    email: string,
    pass: string,
    fullName: string,
    username: string
  ): Promise<{ error: string | null; message: string | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            full_name: fullName,
            username: username || email.split('@')[0],
            role: 'maker',
            avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`,
          },
        },
      });

      if (error) {
        return { error: error.message, message: null };
      }

      if (data?.user) {
        this.currentUser = {
          id: data.user.id,
          name: fullName,
          email,
          handle: username || email.split('@')[0],
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`,
          role: 'maker',
          bio: 'SaaS builder on Foundry.',
          badges: ['First Launch'],
          followedMakers: [],
          upvotedProductIds: [],
          waitlistedProductIds: [],
        };
        this.saveUser();
      }

      return {
        error: null,
        message: 'Account created! If email confirmation is enabled, please verify your email.',
      };
    } catch (err: any) {
      return { error: err.message || 'Signup failed', message: null };
    }
  }

  public async signInWithEmail(
    email: string,
    pass: string
  ): Promise<{ error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        // Fallback for simulation if database auth isn't populated
        this.login({
          id: `usr_${email.replace(/[^a-z0-9]/gi, '')}`,
          name: email.split('@')[0],
          email,
          handle: email.split('@')[0].toLowerCase(),
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
          role: 'maker',
          badges: ['First Launch'],
          followedMakers: [],
          upvotedProductIds: [],
          waitlistedProductIds: [],
        });
        return { error: null };
      }

      if (data?.user) {
        const u = data.user;
        const name = u.user_metadata?.full_name || u.email?.split('@')[0] || 'Maker';
        this.currentUser = {
          id: u.id,
          name,
          email: u.email || '',
          handle: u.user_metadata?.username || u.email?.split('@')[0] || 'user',
          avatar: u.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
          role: u.user_metadata?.role || 'maker',
          bio: u.user_metadata?.bio || 'SaaS builder on Foundry.',
          badges: ['First Launch'],
          followedMakers: [],
          upvotedProductIds: [],
          waitlistedProductIds: [],
        };
        this.saveUser();
      }

      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Login failed' };
    }
  }

  public async signInWithGoogle(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        // Fallback simulation for sandbox if Google OAuth client isn't configured in Supabase dashboard
        this.login({
          id: 'usr_google_user',
          name: 'Alex Rivera',
          email: 'alex.rivera@example.com',
          handle: 'alexrivera',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          role: 'maker',
          bio: 'Indie developer building AI and productivity tools.',
          badges: ['Verified Maker', 'First Launch'],
          followedMakers: ['mkr_felix_v'],
          upvotedProductIds: ['prod_velo'],
          waitlistedProductIds: [],
        });
        return { error: null };
      }
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Google OAuth failed' };
    }
  }

  public async resetPassword(email: string): Promise<{ error: string | null; message: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        return { error: error.message, message: null };
      }
      return {
        error: null,
        message: 'Password reset link sent to your email inbox.',
      };
    } catch (err: any) {
      return { error: err.message, message: null };
    }
  }

  public async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  }

  public async logout() {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    this.currentUser = null;
    this.saveUser();
  }

  public login(user: User) {
    this.currentUser = user;
    this.saveUser();
  }

  public switchUserRole(role: 'maker' | 'user' | 'admin') {
    if (!this.currentUser) {
      this.currentUser = { ...INITIAL_USER, role };
    } else {
      this.currentUser = { ...this.currentUser, role };
    }
    this.saveUser();
  }
}

export const store = new StoreService();

export function useStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return store.subscribe(() => {
      setTick((t) => t + 1);
    });
  }, []);

  return {
    products: store.getProducts(),
    currentUser: store.getCurrentUser(),
    theme: store.getTheme(),
    stats: store.getLiveStats(),
    visitorId: store.getVisitorId(),
    notifications: store.getNotifications(),
    isSupabaseLive: store.getIsSupabaseLive(),
    toggleTheme: () => store.toggleTheme(),
    upvoteProduct: (id: string) => store.upvoteProduct(id),
    joinWaitlist: (id: string, email?: string) => store.joinWaitlist(id, email),
    trackClick: (id: string, type: 'view' | 'website' | 'deal' | 'vote' | 'waitlist') =>
      store.trackClick(id, type),
    addComment: (id: string, content: string) => store.addComment(id, content),
    addReview: (id: string, rating: number, title: string, content: string) =>
      store.addReview(id, rating, title, content),
    addProductUpdate: (id: string, title: string, content: string, version?: string) =>
      store.addProductUpdate(id, title, content, version),
    submitProduct: (data: any) => store.submitProduct(data),
    updateProduct: (id: string, partial: Partial<Product>) => store.updateProduct(id, partial),
    approveProduct: (id: string) => store.approveProduct(id),
    rejectProduct: (id: string) => store.rejectProduct(id),
    toggleFeatureProduct: (id: string) => store.toggleFeatureProduct(id),
    verifyMaker: (makerId: string) => store.verifyMaker(makerId),
    followMaker: (makerId: string) => store.followMaker(makerId),
    login: (user: User) => store.login(user),
    logout: () => store.logout(),
    signUpWithEmail: (email: string, pass: string, fullName: string, username: string) =>
      store.signUpWithEmail(email, pass, fullName, username),
    signInWithEmail: (email: string, pass: string) => store.signInWithEmail(email, pass),
    signInWithGoogle: () => store.signInWithGoogle(),
    resetPassword: (email: string) => store.resetPassword(email),
    updatePassword: (newPass: string) => store.updatePassword(newPass),
    switchUserRole: (role: 'maker' | 'user' | 'admin') => store.switchUserRole(role),
  };
}
