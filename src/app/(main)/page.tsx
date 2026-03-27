export const dynamic = "force-dynamic";

import getDb from "@/lib/db";
import Link from "next/link";
import { UserCheck, Search, LogOut } from "lucide-react";
import { revalidatePath } from "next/cache";
import BadgePrinter from "@/components/BadgePrinter";

// Server action to checkout a visitor
async function checkOutVisitor(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  if (!id) return;

  const db = await getDb(); // ✅ FIXED (await)
  const now = new Date().toISOString();

  // ✅ MSSQL QUERY (replaced SQLite)
  await db.request()
    .input("status", "Checked-out")
    .input("checkOutTime", now)
    .input("id", id)
    .query(`
      UPDATE visitors 
      SET status = @status, check_out_time = @checkOutTime 
      WHERE id = @id
    `);

  revalidatePath("/");
}

export default async function DashboardPage() { // ✅ MUST be async
  const db = await getDb(); // ✅ FIXED

  // ✅ MSSQL QUERY (replaced SQLite)
  const result = await db.request().query(`
    SELECT TOP 100 * FROM visitors
    ORDER BY 
      CASE 
        WHEN status = 'Checked-in' THEN 1 
        WHEN status = 'Pre-booked' THEN 2 
        ELSE 3 
      END,
      check_in_time DESC
  `);

  const visitors = result.recordset as any[];

  const activeCount = visitors.filter(v => v.status === 'Checked-in').length;
  const preBookedCount = visitors.filter(v => v.status === 'Pre-booked').length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ marginBottom: "0.5rem" }}>Visitor Log</h1>
          <p>Manage and monitor facility access</p>
        </div>
        <Link href="/check-in" className="btn btn-primary">
          <UserCheck size={18} />
          Check In Visitor
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3 style={{ color: "var(--text-muted)", fontSize: "0.875rem", textTransform: "uppercase" }}>Active Visitors</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--primary)", marginTop: "0.5rem" }}>{activeCount}</p>
        </div>
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3 style={{ color: "var(--text-muted)", fontSize: "0.875rem", textTransform: "uppercase" }}>Pre-Booked Today</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--warning)", marginTop: "0.5rem" }}>{preBookedCount}</p>
        </div>
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3 style={{ color: "var(--text-muted)", fontSize: "0.875rem", textTransform: "uppercase" }}>Total Logs</h3>
          <p style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--text-main)", marginTop: "0.5rem" }}>{visitors.length}</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border)", display: "flex", gap: "1rem", alignItems: "center" }}>
          <div className="input-group" style={{ marginBottom: 0, flex: 1, position: "relative" }}>
            <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input type="text" placeholder="Search visitors..." className="input-field" style={{ paddingLeft: "2.5rem" }} />
          </div>
        </div>
        
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "var(--bg-base)", borderBottom: "1px solid var(--border)" }}>
                <th style={{ padding: "1rem 1.5rem" }}>Visitor</th>
                <th style={{ padding: "1rem 1.5rem" }}>Host</th>
                <th style={{ padding: "1rem 1.5rem" }}>Purpose</th>
                <th style={{ padding: "1rem 1.5rem" }}>In Time</th>
                <th style={{ padding: "1rem 1.5rem" }}>Status</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visitors.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "3rem", textAlign: "center" }}>
                    No visitors found.
                  </td>
                </tr>
              ) : visitors.map((visitor) => (
                <tr key={visitor.id}>
                  <td style={{ padding: "1rem" }}>
                    <p>{visitor.full_name}</p>
                    <p>{visitor.phone_number}</p>
                  </td>
                  <td style={{ padding: "1rem" }}>{visitor.host_name}</td>
                  <td style={{ padding: "1rem" }}>{visitor.purpose}</td>
                  <td style={{ padding: "1rem" }}>
                    {visitor.check_in_time 
                      ? new Date(visitor.check_in_time).toLocaleTimeString() 
                      : "-"}
                  </td>
                  <td style={{ padding: "1rem" }}>{visitor.status}</td>
                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    {visitor.status === 'Checked-in' && (
                      <>
                        <form action={checkOutVisitor}>
                          <input type="hidden" name="id" value={visitor.id} />
                          <button type="submit">Out</button>
                        </form>
                        <BadgePrinter visitor={visitor} />
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}