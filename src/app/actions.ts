"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Helper to get current organization context
async function getOrgContext(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  
  const { data: dbUser } = await supabase
    .from("users")
    .select("org_id")
    .eq("id", user.id)
    .single();
    
  if (!dbUser || !dbUser.org_id) throw new Error("No organization found for this user");
  return dbUser.org_id;
}

// ✅ CHECK-IN
export async function submitCheckIn(
  prevState: any,
  formData: FormData
) {
  const fullName = formData.get("full_name") as string;
  const phone = formData.get("phone_number") as string;
  const email = formData.get("email") as string;
  const hostId = formData.get("host_id") as string;
  const purpose = formData.get("purpose") as string;

  if (!fullName || !phone || !hostId || !purpose) {
    return { error: "Missing required fields", success: false };
  }

  try {
    const supabase = createClient();
    const orgId = await getOrgContext(supabase);

    // Step 1: Check if visitor already exists in visitors table (by phone in this org)
    let visitorId;
    const { data: existingVisitor } = await supabase
      .from('visitors')
      .select('id')
      .eq('org_id', orgId)
      .eq('phone', phone)
      .single();

    if (existingVisitor) {
      visitorId = existingVisitor.id;
    } else {
      // Create new visitor
      const { data: newVisitor, error: vError } = await supabase
        .from('visitors')
        .insert([{
          org_id: orgId,
          name: fullName,
          phone: phone,
          email: email || null
        }])
        .select('id')
        .single();
        
      if (vError) throw vError;
      visitorId = newVisitor.id;
    }

    // Step 2: Check if they are already actively checked in (active visit)
    const { data: activeVisit } = await supabase
      .from('visits')
      .select('id')
      .eq('org_id', orgId)
      .eq('visitor_id', visitorId)
      .eq('status', 'active')
      .single();

    if (activeVisit) {
      return { error: "Visitor is already checked in", success: false };
    }

    // Step 3: Create the visit log
    const { error: visitError } = await supabase
      .from('visits')
      .insert([{
        org_id: orgId,
        visitor_id: visitorId,
        host_id: hostId,
        purpose: purpose,
        status: 'active'
      }]);

    if (visitError) throw visitError;

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    console.error("Check-in Error:", err);
    return { error: err.message || "Failed to process check-in", success: false };
  }
}

// ✅ PRE-BOOK
export async function submitPreBook(
  prevState: any,
  formData: FormData
) {
  const fullName = formData.get("full_name") as string;
  const phone = formData.get("phone_number") as string;
  const email = formData.get("email") as string;
  const hostId = formData.get("host_id") as string;
  const purpose = formData.get("purpose") as string;

  if (!fullName || !phone || !hostId || !purpose) {
    return { error: "Missing required fields", success: false };
  }

  try {
    const supabase = createClient();
    const orgId = await getOrgContext(supabase);

    let visitorId;
    const { data: existingVisitor } = await supabase
      .from('visitors')
      .select('id')
      .eq('org_id', orgId)
      .eq('phone', phone)
      .single();

    if (existingVisitor) {
      visitorId = existingVisitor.id;
    } else {
      const { data: newVisitor, error: vError } = await supabase
        .from('visitors')
        .insert([{
          org_id: orgId,
          name: fullName,
          phone: phone,
          email: email || null
        }])
        .select('id')
        .single();
        
      if (vError) throw vError;
      visitorId = newVisitor.id;
    }

    // Pre-book creates an empty invitation or scheduled visit. Based on schema.sql, visits has 'scheduled' status
    const { error: visitError } = await supabase
      .from('visits')
      .insert([{
        org_id: orgId,
        visitor_id: visitorId,
        host_id: hostId,
        purpose: purpose,
        status: 'scheduled'
      }]);

    if (visitError) throw visitError;

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    console.error("Pre-book Error:", err);
    return { error: err.message || "Failed to schedule pre-book", success: false };
  }
}