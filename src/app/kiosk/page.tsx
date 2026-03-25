"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitCheckIn } from "@/app/actions";
import { AlertCircle, UserCheck } from "lucide-react";
import Link from "next/link";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending} style={{ marginTop: "1rem", width: "100%", padding: "1.25rem", fontSize: "1.125rem" }}>
      <UserCheck size={24} />
      {pending ? "Processing..." : "Tap to Check In"}
    </button>
  );
}

export default function KioskPage() {
  const [state, formAction] = useFormState(submitCheckIn, { error: "", success: false });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-base)" }}>
      <header style={{ padding: "2rem", background: "var(--bg-surface)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 800 }}>
          <span style={{ fontSize: "2rem" }}>🏢</span> Welcome to our facility
        </h2>
        <Link href="/" className="btn btn-outline" style={{ fontSize: "0.875rem" }}>Exit Kiosk</Link>
      </header>
      
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: "800px" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Self Check-In</h1>
            <p style={{ fontSize: "1.25rem", color: "var(--text-muted)" }}>Please enter your details or confirm your pre-booked visit.</p>
          </div>

          <form action={formAction} className="card animate-fade-in" style={{ padding: "3rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {state?.error && (
              <div style={{ padding: "1.5rem", background: "var(--danger-bg)", color: "var(--danger-text)", borderRadius: "var(--radius-md)", marginBottom: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
                <AlertCircle size={24} />
                <span style={{ fontSize: "1.125rem", fontWeight: 500 }}>{state.error}</span>
              </div>
            )}
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label" style={{ fontSize: "1.125rem", color: "var(--text-muted)" }}>Full Name</label>
                <input type="text" name="fullName" className="input-field" style={{ padding: "1.25rem", fontSize: "1.25rem" }} placeholder="John Doe" required />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label" style={{ fontSize: "1.125rem", color: "var(--text-muted)" }}>Phone Number</label>
                <input type="tel" name="phone" className="input-field" style={{ padding: "1.25rem", fontSize: "1.25rem" }} placeholder="e.g. 555-0100" required />
              </div>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label" style={{ fontSize: "1.125rem", color: "var(--text-muted)" }}>Host Name (Who are you visiting?)</label>
                <input type="text" name="host" className="input-field" style={{ padding: "1.25rem", fontSize: "1.25rem" }} placeholder="Jane Smith" required />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label" style={{ fontSize: "1.125rem", color: "var(--text-muted)" }}>Purpose of Visit</label>
                <input type="text" name="purpose" className="input-field" style={{ padding: "1.25rem", fontSize: "1.25rem" }} placeholder="Meeting" required />
              </div>
            </div>

            <input type="hidden" name="email" value="" />

            <SubmitButton />
          </form>
        </div>
      </main>
    </div>
  );
}
