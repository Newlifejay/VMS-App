import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import KioskCheckInForm from "./kiosk-check-in-form";

export default async function KioskCheckInPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  const { data: dbUser } = await supabase
    .from('users')
    .select('org_id')
    .eq('id', user.id)
    .single();

  if (!dbUser?.org_id) {
    redirect("/onboarding");
  }

  const { data: hostsData } = await supabase
    .from('hosts')
    .select('id, name')
    .eq('org_id', dbUser.org_id)
    .order('name');

  const hosts = hostsData || [];

  return <KioskCheckInForm hosts={hosts} />;
}
