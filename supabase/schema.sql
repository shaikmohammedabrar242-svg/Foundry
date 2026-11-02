-- ==============================================================================
-- FOUNDRY - MINIMALIST SAAS DISCOVERY PLATFORM
-- PRODUCTION SUPABASE DATABASE SCHEMA & RLS MIGRATION
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL
);

-- Seed Default Categories
INSERT INTO public.categories (name, slug) VALUES
    ('AI Tools', 'ai-tools'),
    ('Developer Tools', 'developer-tools'),
    ('Productivity', 'productivity'),
    ('Marketing', 'marketing'),
    ('Design', 'design'),
    ('Finance', 'finance'),
    ('Analytics', 'analytics'),
    ('Automation', 'automation'),
    ('Other', 'other')
ON CONFLICT (slug) DO NOTHING;

-- 3. PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    website TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'maker', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    maker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT,
    story TEXT,
    logo_url TEXT,
    screenshots TEXT[] DEFAULT '{}',
    website_url TEXT NOT NULL,
    demo_url TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'launched' CHECK (status IN ('launched', 'upcoming', 'pending_approval', 'rejected')),
    launch_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    is_verified BOOLEAN NOT NULL DEFAULT false,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. VOTES TABLE (1 Vote per user per product)
CREATE TABLE IF NOT EXISTS public.votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT votes_user_id_product_id_key UNIQUE (user_id, product_id)
);

-- 6. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT reviews_user_id_product_id_key UNIQUE (user_id, product_id)
);

-- 8. FOLLOWS TABLE
CREATE TABLE IF NOT EXISTS public.follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    maker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT follows_follower_id_maker_id_key UNIQUE (follower_id, maker_id)
);

-- 9. WAITLIST TABLE
CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT waitlist_user_id_product_id_key UNIQUE (user_id, product_id)
);

-- 10. LAUNCH DEALS TABLE
CREATE TABLE IF NOT EXISTS public.launch_deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    discount INTEGER NOT NULL CHECK (discount > 0 AND discount <= 100),
    coupon_code TEXT NOT NULL,
    description TEXT,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT true,
    deal_clicks INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. PRODUCT ANALYTICS TABLE
CREATE TABLE IF NOT EXISTS public.product_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('view', 'unique_visitor', 'website_click', 'deal_click', 'vote', 'waitlist')),
    visitor_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. MAKER BADGES TABLE
CREATE TABLE IF NOT EXISTS public.maker_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    maker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_type TEXT NOT NULL CHECK (badge_type IN ('First Launch', 'Verified Maker', 'Community Favourite', 'Serial Builder')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT maker_badges_maker_id_badge_type_key UNIQUE (maker_id, badge_type)
);

-- 14. AUDIT LOGS TABLE (For Admin Actions)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_launch_date ON public.products(launch_date);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_maker_id ON public.products(maker_id);
CREATE INDEX IF NOT EXISTS idx_votes_product_id ON public.votes(product_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON public.votes(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_product_id ON public.comments(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_analytics_product_event_date ON public.product_analytics(product_id, event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_maker_badges_maker_id ON public.maker_badges(maker_id);

-- ==============================================================================
-- AUTOMATED TRIGGERS & FUNCTIONS
-- ==============================================================================

-- 1. Automatically create profile upon user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, full_name, avatar_url, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/initials/svg?seed=' || split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'role', 'user')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Automatic Maker Badge Calculation Function
CREATE OR REPLACE FUNCTION public.evaluate_maker_badges(p_maker_id UUID)
RETURNS VOID AS $$
DECLARE
    launch_count INTEGER;
    max_upvotes INTEGER;
BEGIN
    -- Count launched products
    SELECT COUNT(*) INTO launch_count
    FROM public.products
    WHERE maker_id = p_maker_id AND status = 'launched';

    -- Award 'First Launch' if 1 or more
    IF launch_count >= 1 THEN
        INSERT INTO public.maker_badges (maker_id, badge_type)
        VALUES (p_maker_id, 'First Launch')
        ON CONFLICT DO NOTHING;
    END IF;

    -- Award 'Serial Builder' if 2 or more
    IF launch_count >= 2 THEN
        INSERT INTO public.maker_badges (maker_id, badge_type)
        VALUES (p_maker_id, 'Serial Builder')
        ON CONFLICT DO NOTHING;
    END IF;

    -- Check for 'Community Favourite' (product with >= 100 upvotes)
    SELECT COALESCE(MAX(vote_cnt), 0) INTO max_upvotes
    FROM (
        SELECT COUNT(v.id) AS vote_cnt
        FROM public.products p
        JOIN public.votes v ON v.product_id = p.id
        WHERE p.maker_id = p_maker_id
        GROUP BY p.id
    ) t;

    IF max_upvotes >= 100 THEN
        INSERT INTO public.maker_badges (maker_id, badge_type)
        VALUES (p_maker_id, 'Community Favourite')
        ON CONFLICT DO NOTHING;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Automatic launch promotion: Changes upcoming to launched when launch date passes
CREATE OR REPLACE FUNCTION public.promote_scheduled_launches()
RETURNS INTEGER AS $$
DECLARE
    updated_rows INTEGER;
BEGIN
    UPDATE public.products
    SET status = 'launched',
        updated_at = timezone('utc'::text, now())
    WHERE status = 'upcoming'
      AND launch_date <= timezone('utc'::text, now());

    GET DIAGNOSTICS updated_rows = ROW_COUNT;
    RETURN updated_rows;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.launch_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maker_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can delete their own profile or admin"
    ON public.profiles FOR DELETE USING (auth.uid() = id OR public.is_admin());

-- CATEGORIES
CREATE POLICY "Categories viewable by everyone"
    ON public.categories FOR SELECT USING (true);

CREATE POLICY "Only admins can manage categories"
    ON public.categories FOR ALL USING (public.is_admin());

-- PRODUCTS
CREATE POLICY "Public products viewable by everyone"
    ON public.products FOR SELECT
    USING (status IN ('launched', 'upcoming') OR auth.uid() = maker_id OR public.is_admin());

CREATE POLICY "Authenticated users can submit products"
    ON public.products FOR INSERT
    WITH CHECK (auth.uid() = maker_id);

CREATE POLICY "Makers and admins can update their products"
    ON public.products FOR UPDATE
    USING (auth.uid() = maker_id OR public.is_admin());

CREATE POLICY "Makers and admins can delete their products"
    ON public.products FOR DELETE
    USING (auth.uid() = maker_id OR public.is_admin());

-- VOTES
CREATE POLICY "Votes are viewable by everyone"
    ON public.votes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can cast votes"
    ON public.votes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vote"
    ON public.votes FOR DELETE
    USING (auth.uid() = user_id);

-- COMMENTS
CREATE POLICY "Comments are viewable by everyone"
    ON public.comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can post comments"
    ON public.comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users or admins can delete comments"
    ON public.comments FOR DELETE
    USING (auth.uid() = user_id OR public.is_admin());

-- REVIEWS
CREATE POLICY "Reviews are viewable by everyone"
    ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Authenticated users can post reviews"
    ON public.reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users or admins can delete reviews"
    ON public.reviews FOR DELETE
    USING (auth.uid() = user_id OR public.is_admin());

-- FOLLOWS
CREATE POLICY "Follows are viewable by everyone"
    ON public.follows FOR SELECT USING (true);

CREATE POLICY "Authenticated users can follow"
    ON public.follows FOR INSERT
    WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
    ON public.follows FOR DELETE
    USING (auth.uid() = follower_id);

-- WAITLIST
CREATE POLICY "Waitlist viewable by maker or admin or user"
    ON public.waitlist FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin() OR EXISTS (
        SELECT 1 FROM public.products p WHERE p.id = waitlist.product_id AND p.maker_id = auth.uid()
    ));

CREATE POLICY "Authenticated users can join waitlist"
    ON public.waitlist FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave waitlist"
    ON public.waitlist FOR DELETE
    USING (auth.uid() = user_id);

-- LAUNCH DEALS
CREATE POLICY "Launch deals viewable by everyone"
    ON public.launch_deals FOR SELECT USING (true);

CREATE POLICY "Makers can insert deals for their products"
    ON public.launch_deals FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.products p WHERE p.id = launch_deals.product_id AND p.maker_id = auth.uid()
    ) OR public.is_admin());

CREATE POLICY "Makers can update their deals"
    ON public.launch_deals FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.products p WHERE p.id = launch_deals.product_id AND p.maker_id = auth.uid()
    ) OR public.is_admin());

-- NOTIFICATIONS
CREATE POLICY "Users can only view their own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can mark notifications as read"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- PRODUCT ANALYTICS
CREATE POLICY "Anyone can record analytics events"
    ON public.product_analytics FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Makers can view analytics for their products"
    ON public.product_analytics FOR SELECT
    USING (public.is_admin() OR EXISTS (
        SELECT 1 FROM public.products p WHERE p.id = product_analytics.product_id AND p.maker_id = auth.uid()
    ));

-- MAKER BADGES
CREATE POLICY "Maker badges viewable by everyone"
    ON public.maker_badges FOR SELECT USING (true);

CREATE POLICY "Admins can manage maker badges"
    ON public.maker_badges FOR ALL USING (public.is_admin());

-- AUDIT LOGS
CREATE POLICY "Only admins can view audit logs"
    ON public.audit_logs FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can record audit logs"
    ON public.audit_logs FOR INSERT WITH CHECK (public.is_admin());

-- ==============================================================================
-- STORAGE BUCKETS SETUP
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('product-logos', 'product-logos', true, 2097152, ARRAY['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']),
    ('product-screenshots', 'product-screenshots', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp']),
    ('user-avatars', 'user-avatars', true, 2097152, ARRAY['image/png', 'image/jpeg', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET 
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS Policies
CREATE POLICY "Public Access To Logos"
    ON storage.objects FOR SELECT
    USING (bucket_id IN ('product-logos', 'product-screenshots', 'user-avatars'));

CREATE POLICY "Authenticated Users Can Upload Images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id IN ('product-logos', 'product-screenshots', 'user-avatars') AND auth.role() = 'authenticated');

CREATE POLICY "Users Can Update Their Uploaded Assets"
    ON storage.objects FOR UPDATE
    USING (auth.uid() = owner);
