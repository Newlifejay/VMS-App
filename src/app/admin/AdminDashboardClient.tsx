'use client';

import { motion } from 'framer-motion';
import { Users, Clock, LogOut } from 'lucide-react';
import { useState } from 'react';

type DashboardProps = {
  activeCount: number;
  totalToday: number;
  recentVisits: any[];
}

export default function AdminDashboardClient({ activeCount, totalToday, recentVisits }: DashboardProps) {
  // We don't really need loading state anymore since Server Component fetches
  
  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-[var(--text-muted)] mt-1">Overview of today's visitor activity.</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-[var(--text-muted)]">Today's Date</div>
          <div className="font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[var(--primary-light)]/50 text-[var(--primary)] flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <div className="text-[var(--text-muted)] text-sm font-medium">On-Site Now</div>
            <div className="text-3xl font-bold mt-1">{activeCount}</div>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[var(--success-bg)]/50 text-[var(--success)] flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-[var(--text-muted)] text-sm font-medium">Total Today</div>
            <div className="text-3xl font-bold mt-1">{totalToday}</div>
          </div>
        </motion.div>
      </div>

      {/* Visitors Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel overflow-hidden">
        <div className="p-6 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-surface)]">
          <h2 className="text-xl font-bold">Recent Visitors</h2>
        </div>
        <div className="overflow-x-auto bg-[var(--bg-surface)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] text-sm text-[var(--text-muted)] bg-[var(--bg-base)]/50">
                <th className="py-4 px-6 font-semibold">Visitor Name</th>
                <th className="py-4 px-6 font-semibold">Host</th>
                <th className="py-4 px-6 font-semibold">Purpose</th>
                <th className="py-4 px-6 font-semibold">Check In</th>
                <th className="py-4 px-6 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {recentVisits.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[var(--text-muted)]">No visitors recorded today.</td>
                </tr>
              ) : (
                recentVisits.map((v) => (
                  <tr key={v.id} className="hover:bg-[var(--bg-base)]/50 transition">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-[var(--text-main)]">{v.visitors?.name || 'Unknown'}</div>
                    </td>
                    <td className="py-4 px-6 text-[var(--text-muted)]">{v.hosts?.name || 'Unknown'}</td>
                    <td className="py-4 px-6 text-[var(--text-muted)]">{v.purpose}</td>
                    <td className="py-4 px-6 text-[var(--text-muted)]">
                      {new Date(v.check_in_time).toLocaleTimeString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`status-badge ${v.status === 'active' ? 'status-success' : 'status-warning'}`}>
                        {v.status === 'active' ? 'Active' : v.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
