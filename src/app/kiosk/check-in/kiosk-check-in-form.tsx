"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ArrowRight, User, Briefcase, Camera, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { submitCheckIn } from '@/app/actions';

export default function KioskCheckInForm({ hosts }: { hosts: { id: string, name: string }[] }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  // We must handle the multi-step form manually, then submit via formData at the end.
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setStep(step + 1);
  };

  const handleComplete = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const formElement = document.getElementById("kiosk-form") as HTMLFormElement;
    const formData = new FormData(formElement);

    // Call the server action directly
    const result = await submitCheckIn(null, formData);
    
    setLoading(false);
    
    if (result && result.error) {
      setErrorMsg(result.error);
      // Optional: go back to step 1 or 2 to show error
      setStep(1); 
    } else {
      setStep(4); // Success step
      setTimeout(() => router.push('/kiosk'), 5000);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 50 : -50, opacity: 0 }),
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-2xl mx-auto pb-20">
      
      {step < 4 && (
        <div className="w-full flex items-center justify-between mb-8">
          <Link href="/kiosk" className="inline-flex items-center text-[var(--text-muted)] hover:text-[var(--primary)] transition group font-medium text-lg">
            <ChevronLeft className="w-6 h-6 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back
          </Link>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-2 rounded-full transition-all duration-300 ${step >= i ? 'w-12 bg-[var(--primary)]' : 'w-4 bg-[var(--border)]'}`} />
            ))}
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="w-full mb-4 p-4 bg-[var(--danger-bg)] text-[var(--danger-text)] rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          <p>{errorMsg}</p>
        </div>
      )}

      <div className="w-full relative glass-panel p-8 md:p-12 min-h-[450px] shadow-2xl flex flex-col">
        {/* We use one overarching form that persists all inputs */}
        <form id="kiosk-form" onSubmit={(e) => { e.preventDefault() }} className="contents">
          <AnimatePresence mode="wait" custom={1}>
            {step === 1 && (
              <motion.div key="step1" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="flex-1 flex flex-col">
                <h2 className="text-3xl font-extrabold mb-2">Welcome! Let's get started.</h2>
                <p className="text-[var(--text-muted)] mb-8 text-lg">Please enter your basic information.</p>
                
                <div className="space-y-6 flex-1">
                  <div className="input-group">
                    <label className="input-label text-base">Full Name *</label>
                    <input type="text" name="full_name" required autoFocus className="input-field py-4 text-lg bg-white/60 focus:bg-white" placeholder="Jane Doe" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="input-group">
                      <label className="input-label text-base">Phone *</label>
                      <input type="tel" name="phone_number" required className="input-field py-4 text-lg bg-white/60 focus:bg-white" placeholder="555-0123" />
                    </div>
                    <div className="input-group">
                      <label className="input-label text-base">Email (Optional)</label>
                      <input type="email" name="email" className="input-field py-4 text-lg bg-white/60 focus:bg-white" placeholder="jane@example.com" />
                    </div>
                  </div>
                </div>
                <button type="button" onClick={handleNext} className="btn btn-primary w-full py-4 text-lg mt-8 shadow-lg">Continue <ArrowRight size={20} className="ml-2"/></button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="flex-1 flex flex-col">
                <h2 className="text-3xl font-extrabold mb-2">Who are you visiting?</h2>
                <p className="text-[var(--text-muted)] mb-8 text-lg">Select your host and reason for visit.</p>
                
                <div className="space-y-6 flex-1">
                  <div className="input-group">
                    <label className="input-label text-base flex items-center gap-2"><User size={18}/> Host Name *</label>
                    {hosts.length === 0 && (
                       <p className="text-sm text-[var(--warning)] mb-2">No hosts configured! Admin needs to add employees.</p>
                    )}
                    <select name="host_id" required className="input-field py-4 text-lg bg-white/60" defaultValue="">
                      <option value="" disabled>Select an employee</option>
                      {hosts.map(host => (
                        <option key={host.id} value={host.id}>{host.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label text-base flex items-center gap-2"><Briefcase size={18}/> Purpose of Visit *</label>
                    <select name="purpose" required className="input-field py-4 text-lg bg-white/60 appearance-none" defaultValue="">
                      <option value="" disabled>Select a reason</option>
                      <option value="Meeting">Meeting</option>
                      <option value="Interview">Interview</option>
                      <option value="Delivery">Delivery / Vendor</option>
                      <option value="Personal">Personal</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <button type="button" onClick={() => setStep(1)} className="btn btn-outline py-4 w-1/3 text-lg">Back</button>
                  <button type="button" onClick={handleNext} className="btn btn-primary py-4 w-2/3 text-lg shadow-lg">Continue <ArrowRight size={20} className="ml-2"/></button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="flex-1 flex flex-col items-center justify-center">
                <h2 className="text-3xl font-extrabold mb-2 text-center">Smile for the camera!</h2>
                <p className="text-[var(--text-muted)] mb-8 text-lg text-center">We need a quick photo for your visitor badge.</p>
                
                <div className="flex-1 w-full flex items-center justify-center mb-8">
                  <div className="relative w-64 h-64 rounded-full border-4 border-[var(--primary)]/20 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <Camera size={48} className="text-[var(--text-muted)]" />
                  </div>
                </div>

                <div className="flex gap-4 mt-auto w-full">
                  <button type="button" onClick={() => handleComplete()} disabled={loading} className="btn btn-outline py-4 w-1/3 text-lg bg-white/50">Skip</button>
                  <button type="button" onClick={() => handleComplete()} disabled={loading} className="btn btn-primary py-4 w-2/3 text-lg shadow-lg">{loading ? 'Processing...' : 'Take Photo & Complete'}</button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit" className="flex-1 flex flex-col items-center justify-center text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
                  <CheckCircle className="w-24 h-24 text-[var(--success)] mb-6 mx-auto" />
                </motion.div>
                <h2 className="text-4xl font-black mb-4">You're all set!</h2>
                <p className="text-[var(--text-muted)] text-xl max-w-md">Your host has been notified of your arrival. A visitor badge is being generated.</p>
                <div className="mt-12 text-[var(--success)] font-medium bg-[var(--success-bg)] px-6 py-3 rounded-full">
                  Please take a seat.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
