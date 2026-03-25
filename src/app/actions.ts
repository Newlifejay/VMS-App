"use server";

import getDb from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function checkInVisitor(formData: FormData) {
  const fullName = formData.get("full_name") as string;
  const phone = formData.get("phone_number") as string;
  const email = formData.get("email") as string;
  const host = formData.get("host_name") as string;
  const purpose = formData.get("purpose") as string;

  if (!fullName || !phone || !host || !purpose) {
    return { error: "Missing required fields", success: false };
  }

  const db = await getDb(); // ✅ FIXED

  // ✅ Check if visitor already checked in
  const existingResult = await db.request()
    .input("fullName", fullName)
    .input("phone", phone)
    .query(`
      SELECT TOP 1 id 
      FROM visitors 
      WHERE full_name = @fullName 
        AND phone_number = @phone 
        AND status = 'Checked-in'
    `);

  if (existingResult.recordset.length > 0) {
    return {
      error: "Visitor is currently checked in. Please check them out first.",
      success: false
    };
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  // ✅ Insert new visitor
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