"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CalendarPlus, MonitorSmartphone, LogOut } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Check-in", href: "/check-in", icon: Users },
    { name: "Pre-book", href: "/pre-book", icon: CalendarPlus },
    { name: "Kiosk Mode", href: "/kiosk", icon: MonitorSmartphone },
  ];

  return (
    <aside className="sidebar">
      <div style={{ marginBottom: "3rem" }}>
        <h2 style={{ color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 800 }}>
          <span style={{ fontSize: "1.75rem" }}>🏢</span> VMS
        </h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Visitor Management</p>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                fontWeight: 600,
                color: isActive ? "var(--primary)" : "var(--text-main)",
                backgroundColor: isActive ? "var(--primary-light)" : "transparent",
                transition: "var(--transition)",
              }}
            >
              <Icon size={20} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: "auto", borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
        <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
