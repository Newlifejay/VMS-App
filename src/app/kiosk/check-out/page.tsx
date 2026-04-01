'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, User, Search, CheckCircle, Camera } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckOutPage() {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call for checking out MVP
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => router.push('/kiosk'), 3000);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-lg relative z-10">
        <Link href="/kiosk" className="inline-flex items-center text-[var(--text-muted)] hover:text-[var(--primary)] transition mb-8 group font-medium">
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Start
        </Link>
        
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div 
              key="search"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel p-8"
            >
              <h2 className="text-3xl font-bold mb-2">Check Out</h2>
              <p className="text-[var(--text-muted)] mb-8">Enter your phone number or email to complete your visit.</p>

              <form onSubmit={handleSearch} className="space-y-6">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--text-muted)]">
                    <Search className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="e.g. 555-0123 or jane@example.com"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] text-lg shadow-sm focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition"
                    autoFocus
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading || !search}
                  className="w-full bg-[var(--danger)] hover:bg-[#dc2626] text-white py-4 rounded-xl text-lg font-bold shadow-lg shadow-[var(--danger)]/30 transition disabled:opacity-50"
                >
                  {loading ? 'Searching...' : 'Find & Check Out'}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-10 text-center flex flex-col items-center"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-500 shadow-inner">
                <CheckCircle className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold mb-2">You're checked out!</h2>
              <p className="text-[var(--text-muted)] text-lg">Thank you for visiting. Have a great day!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
