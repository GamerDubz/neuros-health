"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth & setup flow
    setTimeout(() => {
      // Typically we'd push to the first-time setup or dashboard
      router.push("/home?setup=true");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Aura Background */}
      <div className="absolute top-[-10vh] right-[-10vw] w-[500px] h-[500px] bg-primary-fixed/30 rounded-full blur-[120px] mix-blend-multiply opacity-50 animate-glow-pulse" />
      <div className="absolute bottom-[-10vh] left-[-10vw] w-[500px] h-[500px] bg-tertiary-fixed/30 rounded-full blur-[120px] mix-blend-multiply opacity-50 animate-glow-pulse" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-[440px] z-10 animate-fade-slide-up">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4">
           <Link href="/" className="inline-flex w-12 h-12 bg-surface-container shadow-sm rounded-full items-center justify-center hover:scale-105 transition-transform">
             <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>potted_plant</span>
           </Link>
           <h1 className="text-[2.5rem] font-extrabold text-on-surface tracking-tight leading-tight mt-2">
             The first step.
           </h1>
           <p className="text-on-surface-variant text-base">
             Create your private, secure account to start tracking your health journey.
           </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-5">
           <div className="space-y-1">
             <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mx-4">Preferred Name</label>
             <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-4 text-on-surface-variant/50">person</span>
                <input 
                  type="text" 
                  required
                  placeholder="What should we call you?"
                  className="w-full h-14 bg-surface-container-lowest border border-surface-container rounded-2xl pl-12 pr-4 text-[15px] font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                />
             </div>
           </div>

           <div className="space-y-1">
             <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mx-4">Email</label>
             <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-4 text-on-surface-variant/50">mail</span>
                <input 
                  type="email" 
                  required
                  placeholder="your@email.com"
                  className="w-full h-14 bg-surface-container-lowest border border-surface-container rounded-2xl pl-12 pr-4 text-[15px] font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                />
             </div>
           </div>

           <div className="space-y-1 block mb-8">
             <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mx-4">Password</label>
             <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-4 text-on-surface-variant/50">lock</span>
                <input 
                  type="password" 
                  required
                  placeholder="Min 8 characters"
                  className="w-full h-14 bg-surface-container-lowest border border-surface-container rounded-2xl pl-12 pr-4 text-[15px] font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                />
                <button type="button" className="absolute right-4 top-4 text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">visibility</span>
                </button>
             </div>
           </div>

           <button 
             type="submit" 
             disabled={loading}
             className="w-full h-14 mt-4 rounded-full gradient-primary text-white font-bold text-[17px] shadow-btn active:scale-[0.98] transition-all flex items-center justify-center hover:brightness-105 disabled:opacity-70"
           >
             {loading ? <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span> : "Create Account"}
           </button>
        </form>

        <p className="text-sm text-center font-semibold text-on-surface-variant mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>

        {/* Legal footprint */}
        <p className="text-[11px] text-center text-on-surface-variant mt-16 max-w-[280px] mx-auto opacity-70">
          By continuing, you verify that you have read our <Link href="/#privacy" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
