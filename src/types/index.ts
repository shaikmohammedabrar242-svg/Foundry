export type ProductCategory = 
  | 'AI Tools'
  | 'Developer Tools'
  | 'Productivity'
  | 'Marketing'
  | 'Design'
  | 'Finance'
  | 'Analytics'
  | 'Automation'
  | 'Other';

export type MakerBadge = 
  | 'First Launch'
  | 'Verified Maker'
  | 'Community Favourite'
  | 'Serial Builder';

export interface ProductDeal {
  discountPercent: number;
  code: string;
  description: string;
  dealClicks: number;
  expiresAt?: string;
}

export interface MakerInfo {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  badges: MakerBadge[];
  streakCount: number;
  website?: string;
  twitter?: string;
  github?: string;
}

export interface ProductUpdate {
  id: string;
  date: string;
  title: string;
  content: string;
  version?: string;
}

export interface Comment {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  isMaker?: boolean;
  isVerified?: boolean;
  content: string;
  createdAt: string;
  likes: number;
}

export interface Review {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  rating: number; // 1-5
  title: string;
  content: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  story: string;
  category: ProductCategory;
  logoUrl: string;
  screenshotUrl: string;
  galleryUrls?: string[];
  websiteUrl: string;
  demoUrl?: string;
  upvotes: number;
  upvotedBy: string[];
  status: 'launched' | 'upcoming' | 'pending_approval' | 'rejected';
  launchDate: string; // ISO date string
  isVerified: boolean;
  isFeatured: boolean;
  isRising: boolean;
  deal?: ProductDeal;
  maker: MakerInfo;
  views: number;
  websiteClicks: number;
  waitlistCount: number;
  waitlistUsers: string[];
  updates: ProductUpdate[];
  comments: Comment[];
  reviews: Review[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  handle: string;
  avatar: string;
  role: 'maker' | 'user' | 'admin';
  bio?: string;
  badges: MakerBadge[];
  followedMakers: string[];
  upvotedProductIds: string[];
  waitlistedProductIds: string[];
}
