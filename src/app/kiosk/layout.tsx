import { ReactNode } from 'react';

export default function KioskLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[var(--bg-base)] overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-[var(--primary)]/10 to-transparent blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-[var(--primary-light)]/40 to-transparent blur-3xl z-0" />
      
      {/* Brand Watermark / Top Bar */}
      <div className="absolute top-0 w-full p-8 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--primary)] shadow-md"></div>
          <span className="text-xl font-bold tracking-tight text-[var(--text-main)]">Acme Corp</span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="w-full max-w-5xl px-8 z-10 relative">
        {children}
      </main>
    </div>
  );
}
