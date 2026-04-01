'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, LogOut, Users, FileText, MonitorSmartphone } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Visitors', href: '/admin/visitors', icon: Users },
    { name: 'Logs', href: '/admin/logs', icon: FileText },
    { name: 'Kiosk Launch', href: '/kiosk', icon: MonitorSmartphone, external: true },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="layout-container bg-[var(--bg-base)]">
      {/* Sidebar */}
      <aside className="sidebar shadow-lg shadow-[var(--shadow-glass)] border-r border-[var(--border)]">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center font-bold">V</div>
          <span className="text-xl font-bold tracking-tight text-[var(--text-main)]">VMS Admin</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                target={item.external ? '_blank' : undefined}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium",
                  isActive 
                    ? "bg-[var(--primary-light)] text-[var(--primary)]" 
                    : "text-[var(--text-muted)] hover:bg-[var(--bg-base)] hover:text-[var(--text-main)]"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-[var(--primary)]" : "")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-[var(--border)] pt-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left text-[var(--danger)] hover:bg-[var(--danger-bg)] transition font-medium"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
