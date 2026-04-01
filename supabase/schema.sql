-- Create tables for Visitor Management System

-- 1. Organizations
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    primary_color TEXT DEFAULT '#4f46e5',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Users (Extends auth.users, holds role and tenant ID)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    role TEXT CHECK (role IN ('admin', 'receptionist', 'security')),
    options JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Hosts (Synced from Microsoft 365 / Azure AD)
CREATE TABLE public.hosts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    job_title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Visitors
CREATE TABLE public.visitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Visits
CREATE TABLE public.visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    visitor_id UUID NOT NULL REFERENCES public.visitors(id) ON DELETE CASCADE,
    host_id UUID NOT NULL REFERENCES public.hosts(id) ON DELETE SET NULL,
    purpose TEXT NOT NULL,
    check_in_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    check_out_time TIMESTAMP WITH TIME ZONE,
    status TEXT CHECK (status IN ('active', 'completed', 'scheduled', 'cancelled')) DEFAULT 'active'
);

-- 6. Invitations
CREATE TABLE public.invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    visitor_name TEXT,
    visitor_email TEXT NOT NULL,
    host_id UUID NOT NULL REFERENCES public.hosts(id) ON DELETE CASCADE,
    visit_date DATE NOT NULL,
    status TEXT CHECK (status IN ('pending', 'used', 'expired')) DEFAULT 'pending',
    qr_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Setup
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Utility function to get current user's org_id
CREATE OR REPLACE FUNCTION get_current_org_id()
RETURNS UUID AS $$
DECLARE
    current_org_id UUID;
BEGIN
    SELECT org_id INTO current_org_id FROM public.users WHERE id = auth.uid() LIMIT 1;
    RETURN current_org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies for Organizations
-- Users can read their own organization
CREATE POLICY "Users can read own organization" ON public.organizations
    FOR SELECT USING (id = get_current_org_id());

-- Policies for Users
-- Users can read users in their own organization
CREATE POLICY "Users can view org peers" ON public.users
    FOR SELECT USING (org_id = get_current_org_id());

-- Policies for Hosts
-- Users can view, insert, update hosts in their own organization
CREATE POLICY "Org hosts access" ON public.hosts
    FOR ALL USING (org_id = get_current_org_id());

-- Policies for Visitors
CREATE POLICY "Org visitors access" ON public.visitors
    FOR ALL USING (org_id = get_current_org_id());

-- Policies for Visits
CREATE POLICY "Org visits access" ON public.visits
    FOR ALL USING (org_id = get_current_org_id());

-- Policies for Invitations
CREATE POLICY "Org invitations access" ON public.invitations
    FOR ALL USING (org_id = get_current_org_id());
