"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitCheckIn } from "@/app/actions";
import { AlertCircle, UserCheck } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending} style={{ marginTop: "1rem", width: "100%", padding: "1rem" }}>
      <UserCheck size={18} />
      {pending ? "Registering..." : "Complete Check-In"}
    </button>
  );
}

export default function CheckInPage() {
  const [state, formAction] = useFormState(submitCheckIn, { error: "", success: false });

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ marginBottom: "0.5rem" }}>Check-In Visitor</h1>
        <p>Register a new walk-in visitor or arrive a pre-booked guest.</p>
      </div>

      <form action={formAction} className="card animate-fade-in" style={{ display: "flex", flexDirection: "column" }}>
        {state?.error && (
          <div style={{ padding: "1rem", background: "var(--danger-bg)", color: "var(--danger-text)", borderRadius: "var(--radius-md)", marginBottom: "1.5rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <AlertCircle size={18} />
            <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{state.error}</span>
          </div>
        )}

        <div className="input-group">
          <label className="input-label" htmlFor="fullName">Full Name *</label>
          <input type="text" id="fullName" name="fullName" className="input-field" placeholder="Jane Doe" required />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="input-group">
            <label className="input-label" htmlFor="phone">Phone Number *</label>
            <input type="tel" id="phone" name="phone" className="input-field" placeholder="+1 (555) 000-0000" required />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="email">Email (Optional)</label>
            <input type="email" id="email" name="email" className="input-field" placeholder="jane@example.com" />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="host">Host / Employee to Visit *</label>
          <input type="text" id="host" name="host" className="input-field" placeholder="John Smith" required />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="purpose">Purpose of Visit *</label>
          <select id="purpose" name="purpose" className="input-field" required>
            <option value="">Select purpose...</option>
            <option value="Meeting">Meeting</option>
            <option value="Interview">Interview</option>
            <option value="Delivery">Delivery</option>
            <option value="Personal">Personal</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
