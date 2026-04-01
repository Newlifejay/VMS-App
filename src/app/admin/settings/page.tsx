'use client';

import { useState } from 'react';
import { Save, UploadCloud, PaintBucket } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const [orgName, setOrgName] = useState('Acme Corp');
  const [primaryColor, setPrimaryColor] = useState('#4f46e5');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Organization Settings</h1>
        <p className="text-[var(--text-muted)] mt-1">Manage your brand, logo, and preferences.</p>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-8">
        <form onSubmit={handleSave} className="space-y-8">
          
          {/* General Settings */}
          <div className="border-b border-[var(--border)] pb-8">
            <h2 className="text-xl font-semibold mb-4 text-[var(--text-main)]">General Info</h2>
            <div className="max-w-md">
              <div className="input-group">
                <label className="input-label">Organization Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  required 
                />
              </div>
            </div>
          </div>

          {/* Branding Settings */}
          <div className="border-b border-[var(--border)] pb-8">
            <h2 className="text-xl font-semibold mb-4 text-[var(--text-main)]">Branding</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Logo Upload */}
              <div>
                <label className="input-label mb-2 block">Company Logo</label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-[var(--border)] px-6 py-6 hover:border-[var(--primary)] transition-colors bg-[var(--bg-surface)]">
                  <div className="text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-[var(--text-muted)]" aria-hidden="true" />
                    <div className="mt-4 flex text-sm leading-6 text-[var(--text-muted)] justify-center">
                      <label className="relative cursor-pointer rounded-md font-semibold text-[var(--primary)] focus-within:outline-none focus-within:ring-2 hover:text-[var(--primary-hover)]">
                        <span>Upload a file</span>
                        <input type="file" className="sr-only" />
                      </label>
                    </div>
                    <p className="text-xs leading-5 mt-1">PNG, JPG, GIF max 5MB</p>
                  </div>
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className="input-label mb-2 block flex items-center gap-2">
                  <PaintBucket size={16}/> Primary Color
                </label>
                <div className="flex items-center gap-4 mt-2">
                  <div 
                    className="w-16 h-16 rounded-lg shadow-sm border border-[var(--border)]"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <div className="flex-1">
                    <input 
                      type="color" 
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-full h-10 border-0 p-0 rounded cursor-pointer" 
                    />
                    <div className="text-sm font-mono mt-1 text-[var(--text-muted)] uppercase">
                      {primaryColor}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-2">
            {success && (
              <span className="text-[var(--success)] font-medium text-sm animate-fade-in">
                Settings saved successfully!
              </span>
            )}
            <button 
              type="submit" 
              className="btn btn-primary px-8"
              disabled={loading}
            >
              <Save size={18} className="mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
