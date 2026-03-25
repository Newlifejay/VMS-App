"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitPreBook } from "@/app/actions";
import { AlertCircle, CalendarPlus } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending} style={{ marginTop: "1rem", width: "100%", padding: "1rem" }}>
      <CalendarPlus size={18} />
      {pending ? "Pre-Booking..." : "Submit Pre-Book"}
    </button>
  );
}

export default function PreBookPage() {
  const [state, formAction] = useFormState(submitPreBook, { error: "", success: false });

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ marginBottom: "0.5rem" }}>Pre-Book Visitor</h1>
        <p>Schedule a visitor in advance. They can check in easily upon arrival.</p>
      </div>

      <form action={formAction} className="card animate-fade-in" style={{ display: "flex", flexDirection: "column" }}>
        {state?.error && (
          <div style={{ padding: "1rem", background: "var(--danger-bg)", color: "var(--danger-text)", borderRadius: "var(--radius-md)", marginBottom: "1.5rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <AlertCircle size={18} />
            <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{state.error}</span>
          </div>
        )}

        <div className="input-group">
          <label className="input-label" htmlFor="fullName">Visitor Full Name *</label>
          <input type="text" id="fullName" name="fullName" className="input-field" placeholder="John Doe" required />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="phone">Visitor Phone Number *</label>
          <input type="tel" id="phone" name="phone" className="input-field" placeholder="+1 (555) 000-0000" required />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="host">Host / Employee Name *</label>
          <input type="text" id="host" name="host" className="input-field" placeholder="Jane Smith" required />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="purpose">Purpose *</label>
          <input type="text" id="purpose" name="purpose" className="input-field" placeholder="e.g. Project meeting" required />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
