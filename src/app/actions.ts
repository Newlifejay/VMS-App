"use server";

import getDb from "@/lib/db";
import { revalidatePath } from "next/cache";

// ✅ CHECK-IN
export async function submitCheckIn(
  prevState: any,
  formData: FormData
) {
  const fullName = formData.get("full_name") as string;
  const phone = formData.get("phone_number") as string;
  const email = formData.get("email") as string;
  const host = formData.get("host_name") as string;
  const purpose = formData.get("purpose") as string;

  if (!fullName || !phone || !host || !purpose) {
    return { error: "Missing required fields", success: false };
  }

  const db = await getDb();

  const existing = await db.request()
    .input("fullName", fullName)
    .input("phone", phone)
    .query(`
      SELECT TOP 1 id 
      FROM visitors 
      WHERE full_name = @fullName 
        AND phone_number = @phone 
        AND status = 'Checked-in'
    `);

  if (existing.recordset.length > 0) {
    return { error: "Visitor already checked in", success: false };
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.request()
    .input("id", id)
    .input("fullName", fullName)
    .input("phone", phone)
    .input("email", email || null)
    .input("host", host)
    .input("purpose", purpose)
    .input("checkInTime", now)
    .input("status", "Checked-in")
    .query(`
      INSERT INTO visitors (
        id, full_name, phone_number, email, host_name, purpose, check_in_time, status
      ) VALUES (
        @id, @fullName, @phone, @email, @host, @purpose, @checkInTime, @status
      )
    `);

  revalidatePath("/");
  return { success: true };
}

// ✅ PRE-BOOK
export async function submitPreBook(
  prevState: any,
  formData: FormData
) {
  const fullName = formData.get("full_name") as string;
  const phone = formData.get("phone_number") as string;
  const email = formData.get("email") as string;
  const host = formData.get("host_name") as string;
  const purpose = formData.get("purpose") as string;

  if (!fullName || !phone || !host || !purpose) {
    return { error: "Missing required fields", success: false };
  }

  const db = await getDb();

  const id = crypto.randomUUID();

  await db.request()
    .input("id", id)
    .input("fullName", fullName)
    .input("phone", phone)
    .input("email", email || null)
    .input("host", host)
    .input("purpose", purpose)
    .input("status", "Pre-booked")
    .query(`
      INSERT INTO visitors (
        id, full_name, phone_number, email, host_name, purpose, status
      ) VALUES (
        @id, @fullName, @phone, @email, @host, @purpose, @status
      )
    `);

  revalidatePath("/");
  return { success: true };
}