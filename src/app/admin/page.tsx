import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminDashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: dbUser } = await supabase
    .from('users')
    .select('org_id')
    .eq('id', user.id)
    .single();

  if (!dbUser?.org_id) redirect('/onboarding');
  const orgId = dbUser.org_id;

  // Get today's visits
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: recentVisitsData } = await supabase
    .from('visits')
    .select(`
      id,
      purpose,
      check_in_time,
      status,
      visitors ( name ),
      hosts ( name )
    `)
    .eq('org_id', orgId)
    .gte('check_in_time', today.toISOString())
    .order('check_in_time', { ascending: false });

  const recentVisits = recentVisitsData || [];
  const totalToday = recentVisits.length;
  const activeCount = recentVisits.filter(v => v.status === 'active').length;

  return (
    <AdminDashboardClient 
      activeCount={activeCount} 
      totalToday={totalToday} 
      recentVisits={recentVisits} 
    />
  );
}
