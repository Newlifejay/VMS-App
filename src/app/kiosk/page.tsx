'use client';

import { motion } from 'framer-motion';
import { LogIn, LogOut, QrCode } from 'lucide-react';
import Link from 'next/link';

export default function KioskLandingPage() {
  return (
    <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 space-y-4"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--text-main)] leading-tight">
          Welcome to <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)]">
            Our Office
          </span>
        </h1>
        <p className="text-xl text-[var(--text-muted)] max-w-md">
          Please tap one of the options to register your visit.
        </p>

        <div className="pt-6">
          <button className="flex items-center gap-3 text-[var(--primary)] font-medium bg-[var(--primary-light)]/30 px-6 py-3 rounded-full hover:bg-[var(--primary-light)]/60 transition shadow-sm border border-[var(--primary)]/10">
            <QrCode className="w-5 h-5" />
            Scan QR Code to Check In
          </button>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex-shrink-0 flex flex-col gap-6 w-full max-w-sm"
      >
        <Link href="/kiosk/check-in" className="group">
          <div className="glass-panel p-8 text-center cursor-pointer hover:border-[var(--primary)]/50 hover:shadow-lg transition flex flex-col items-center gap-4 bg-[var(--bg-surface)]/80">
            <div className="w-20 h-20 rounded-full bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <LogIn className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Check In</h2>
              <p className="text-[var(--text-muted)] mt-1">I am a visitor arriving now</p>
            </div>
          </div>
        </Link>
        
        <Link href="/kiosk/check-out" className="group">
          <div className="glass-panel p-8 text-center cursor-pointer hover:border-[var(--danger)]/30 hover:shadow-lg transition flex flex-col items-center gap-4 bg-[var(--bg-surface)]/80">
            <div className="w-16 h-16 rounded-full bg-[var(--danger-bg)] text-[var(--danger)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <LogOut className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Check Out</h2>
              <p className="text-[var(--text-muted)] mt-1 text-sm">I am leaving the building</p>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
