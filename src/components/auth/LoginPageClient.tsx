"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth check & redirect to dashboard
    setTimeout(() => {
      router.push("/home");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Aura Background */}
      <div className="absolute top-[-10vh] left-[-10vw] w-[500px] h-[500px] bg-primary-container/30 rounded-full blur-[120px] mix-blend-multiply opacity-50 animate-glow-pulse" />
      <div className="absolute bottom-[-10vh] right-[-10vw] w-[500px] h-[500px] bg-secondary-container/20 rounded-full blur-[120px] mix-blend-multiply opacity-50 animate-glow-pulse" style={{ animationDelay: '3s' }} />

      <div className="w-full max-w-[440px] z-10 animate-fade-slide-up">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4">
           <Link href="/" className="inline-flex w-12 h-12 bg-surface-container shadow-sm rounded-full items-center justify-center hover:scale-105 transition-transform">
             <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>potted_plant</span>
           </Link>
           <h1 className="text-[2.5rem] font-extrabold text-on-surface tracking-tight leading-tight mt-2">
             Welcome back.
           </h1>
           <p className="text-on-surface-variant text-base">
             Log in to your Neuros Health account.
           </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
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
             <div className="flex justify-between items-center mx-4">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Password</label>
                <button type="button" className="text-xs font-semibold text-primary hover:underline transition-all">Forgot password?</button>
             </div>
             
             <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-4 text-on-surface-variant/50">lock</span>
                <input 
                  type="password" 
                  required
                  placeholder="Enter your password"
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
             className="w-full h-14 mt-6 rounded-full gradient-primary text-white font-bold text-[17px] shadow-btn active:scale-[0.98] transition-all flex items-center justify-center hover:brightness-105 disabled:opacity-70"
           >
             {loading ? <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span> : "Sign In"}
           </button>
        </form>

        <p className="text-sm text-center font-semibold text-on-surface-variant mt-8">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
