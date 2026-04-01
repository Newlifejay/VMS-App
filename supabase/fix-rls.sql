-- Fix missing INSERT and UPDATE policies for onboarding

-- 1. Allow authenticated users to create an organization
CREATE POLICY "Authenticated users can create originations" 
ON public.organizations 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- 2. Allow authenticated users to update their own organization
CREATE POLICY "Users can update own organization" 
ON public.organizations 
FOR UPDATE 
USING (id = get_current_org_id());

-- 3. Allow users to insert their own profile record
CREATE POLICY "Users can insert their own profile" 
ON public.users 
FOR INSERT 
WITH CHECK (id = auth.uid());

-- 4. Allow users to update their own profile record
CREATE POLICY "Users can update their own profile" 
ON public.users 
FOR UPDATE 
USING (id = auth.uid());
