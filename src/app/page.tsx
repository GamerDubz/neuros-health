"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mobile redirect logic
    if (window.innerWidth < 768) {
      router.replace("/onboarding");
    } else {
      setMounted(true);
    }
  }, [router]);

  if (!mounted) return null; // Avoid hydration mismatch or flashing content on mobile

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface to-primary-container/10 font-sans text-on-surface relative overflow-hidden">
      
      {/* GLOW ORBS (Background) */}
      <div className="fixed bottom-[-96px] left-[-96px] w-[320px] h-[320px] bg-primary-container/5 rounded-full blur-[60px] pointer-events-none -z-10 animate-glow-pulse" />
      <div className="fixed top-[-96px] right-[-96px] w-[320px] h-[320px] bg-secondary/5 rounded-full blur-[60px] pointer-events-none -z-10 animate-glow-pulse" style={{ animationDelay: "2s" }} />

      {/* Hero Glow Orbs */}
      <div className="absolute bottom-[-30px] right-[10%] w-[500px] h-[500px] bg-primary-fixed/15 blur-[100px] -z-10 animate-glow-pulse" />
      <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] bg-secondary-fixed/10 blur-[80px] -z-10 animate-glow-pulse" style={{ animationDelay: "4s" }} />

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-surface/88 backdrop-blur-xl h-[72px] border-b border-transparent">
        <div className="max-w-7xl mx-auto px-12 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[28px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>potted_plant</span>
            <span className="font-extrabold text-xl text-primary tracking-tight">Neuros Health</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors duration-150">Features</Link>
            <Link href="#how-it-works" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors duration-150">How It Works</Link>
            <Link href="#privacy" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors duration-150">Privacy</Link>
            <Link href="#pricing" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors duration-150">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-primary px-4 py-2 hover:bg-surface-container-low rounded-full transition-colors">Sign In</Link>
            <Link href="/onboarding" className="h-[44px] px-6 rounded-full font-bold text-white text-[14px] flex items-center justify-center gradient-primary shadow-btn hover:brightness-105 active:scale-95 transition-all">
              Get Started Free &rarr;
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="min-h-screen flex items-center pt-24 pb-16 relative">
        <div className="max-w-7xl mx-auto px-16 w-full grid grid-cols-2 gap-16 items-center">
          
          {/* Left Column */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low w-fit animate-fade-slide-down" style={{ animationDelay: "0.1s" }}>
               <span className="material-symbols-outlined text-[16px] text-primary" aria-hidden>spa</span>
               <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                 Free to use · Private by design
               </span>
            </div>
            
            <h1 className="text-[4rem] font-extrabold leading-[1.05] tracking-tight mt-8 text-on-surface">
               Your health,<br />
               <span className="text-primary">companion.</span>
            </h1>
            
            <p className="text-lg text-on-surface-variant leading-[1.7] max-w-[480px] mt-6 animate-fade-slide-up" style={{ animationDelay: "0.7s" }}>
               Neuros Health is the pharmacy companion app built for people managing chronic conditions and long-term medications. Private, intelligent, and designed to feel like support — not surveillance.
            </p>
            
            <div className="flex items-center gap-5 mt-10 animate-fade-slide-up" style={{ animationDelay: "0.9s" }}>
               <Link href="/onboarding" className="h-[56px] px-8 rounded-full font-bold text-white text-base flex items-center justify-center gradient-primary shadow-btn hover:brightness-105 active:scale-95 transition-all">
                  Get Started Free &rarr;
               </Link>
               <button className="flex items-center gap-2 text-primary font-semibold text-sm hover:opacity-80 transition-opacity">
                  <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                  Watch how it works
               </button>
            </div>
            
            <div className="flex items-center gap-3 mt-8 animate-fade-in" style={{ animationDelay: "1.1s" }}>
              <div className="flex rtl:space-x-reverse -space-x-2">
                 {['JD', 'AM', 'KS', 'RK'].map((initials, i) => (
                   <div key={i} className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed font-bold text-xs flex items-center justify-center border-2 border-surface">
                     {initials}
                   </div>
                 ))}
              </div>
              <span className="text-sm text-on-surface-variant">
                Trusted by 2,400+ patients managing chronic conditions
              </span>
            </div>
          </div>
          
          {/* Right Column (Phone Mockup) */}
          <div className="relative flex items-center justify-center h-[600px]">
             {/* The Phone */}
             <div className="w-[300px] h-[600px] rounded-[3rem] bg-surface-container-lowest shadow-[0_40px_80px_rgba(21,28,39,0.12)] border-8 border-surface-container rotate-[2deg] overflow-hidden flex flex-col relative z-10 animate-scale-spring" style={{ animationDelay: "0.4s" }}>
                {/* Simulated App Header */}
                <div className="px-5 py-4 flex justify-between items-center bg-surface/80 backdrop-blur-md z-20 sticky top-0">
                   <div className="w-24 h-4 rounded-full bg-surface-container"></div>
                   <div className="w-8 h-8 rounded-full bg-primary-fixed"></div>
                </div>
                {/* Simulated Dashboard Content */}
                <div className="p-5 flex-1 relative bg-surface">
                   {/* Greeting */}
                   <div className="w-32 h-6 rounded bg-surface-container mb-2"></div>
                   <div className="w-20 h-3 rounded bg-surface-container-low mb-6"></div>
                   
                   {/* Tree Card */}
                   <div className="h-48 rounded-2xl bg-gradient-to-br from-primary-fixed to-surface-container-low p-4 flex flex-col items-center justify-center relative mb-6">
                      <div className="absolute top-3 right-3 w-16 h-5 rounded-full bg-white/50 backdrop-blur-sm"></div>
                      <span className="material-symbols-outlined text-[80px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>forest</span>
                      <div className="w-24 h-4 rounded bg-primary-container/20 mt-4"></div>
                   </div>

                   {/* Meds section */}
                   <div className="w-24 h-4 rounded bg-surface-container mb-4"></div>
                   <div className="h-16 rounded-xl bg-surface-container-lowest shadow-sm mb-3"></div>
                   <div className="h-16 rounded-xl bg-surface-container-lowest shadow-sm"></div>
                </div>
                {/* Bottom Nav */}
                <div className="h-16 bg-white flex justify-around items-center border-t border-surface-container-low sticky bottom-0 z-20">
                   {[1,2,3,4,5].map(i => <div key={i} className="w-6 h-6 rounded-md bg-surface-container-low"></div>)}
                </div>
             </div>

             {/* Floating Badges */}
             <div className="absolute top-[80px] left-[-20px] bg-white/85 backdrop-blur-md px-4 py-2 rounded-2xl shadow-[0_20px_60px_rgba(21,28,39,0.10)] font-bold text-sm text-on-surface z-20 animate-scale-spring animate-float-badge flex items-center gap-2" style={{ animationDelay: "0.9s" }}>
                <span className="material-symbols-outlined text-[18px] text-[#f97316]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden>local_fire_department</span>
                12 Day Streak
             </div>
             
             <div className="absolute bottom-[60px] right-[-20px] bg-white/85 backdrop-blur-md px-4 py-2 rounded-2xl shadow-[0_20px_60px_rgba(21,28,39,0.10)] font-bold text-sm text-on-surface z-20 animate-scale-spring flex items-center gap-2" style={{ animationDelay: "1.1s", animation: "scaleSpring 0.6s ease 1.1s both, floatBadge 4s ease-in-out infinite 2s" }}>
                <span className="material-symbols-outlined text-[18px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden>check_circle</span>
                Sertraline taken · 8:00 AM
             </div>

             <div className="absolute top-[160px] right-[-40px] bg-white/85 backdrop-blur-md px-4 py-2 rounded-2xl shadow-[0_20px_60px_rgba(21,28,39,0.10)] font-bold text-sm text-on-surface z-20 animate-scale-spring flex items-center gap-2" style={{ animationDelay: "1.3s" }}>
                <span className="material-symbols-outlined text-tertiary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                87% adherence this month
             </div>
          </div>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section id="features" className="py-[48px] max-w-[960px] mx-auto px-8">
         <div className="flex justify-between items-center relative z-10">
            {[
              { icon: 'medical_services', title: 'Medication Tracking', sub: 'Daily reminders + history' },
              { icon: 'healing', title: 'AI Health Guidance', sub: 'Symptom checker built in' },
              { icon: 'lock', title: '100% Private', sub: 'Your data stays yours' },
              { icon: 'forest', title: 'Growth Rewards', sub: 'Streaks, badges, your tree', fill: 1 },
              { icon: 'local_pharmacy', title: 'Pharmacy Connected', sub: 'Direct pharmacist access' },
            ].map((feat, i) => (
               <div key={i} className="flex flex-col items-center text-center gap-3 animate-fade-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center">
                     <span className="material-symbols-outlined text-[32px] text-primary" style={{ fontVariationSettings: `'FILL' ${feat.fill || 0}` }}>
                        {feat.icon}
                     </span>
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-on-surface leading-tight">{feat.title}</h3>
                    <p className="text-[12px] text-on-surface-variant mt-1">{feat.sub}</p>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-surface-container-low py-[96px] w-full">
         <div className="max-w-7xl mx-auto px-16 relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest text-primary text-center mb-4">How It Works</p>
            <h2 className="text-[2.5rem] font-extrabold tracking-tight text-center text-on-surface max-w-[560px] mx-auto mb-16">
               Three steps to feeling supported.
            </h2>
            
            <div className="grid grid-cols-3 gap-8">
               {[
                 { num: '01', title: 'Add your medications', desc: 'Search from thousands of drugs. Set your doses, times, and get smart reminders that actually work.', icon: 'pill' },
                 { num: '02', title: 'Track every day', desc: 'Mark doses taken. Watch your health tree grow. Earn badges for streaks that would make your pharmacist proud.', icon: 'task_alt' },
                 { num: '03', title: 'Get guidance when you need it', desc: 'Describe your symptoms and get AI-powered triage. Know when to self-care, when to call Healthline, when to call 111.', icon: 'support_agent' }
               ].map((step, i) => (
                  <div key={step.num} className="bg-surface-container-lowest p-8 rounded-[1.5rem] shadow-[0_10px_40px_rgba(21,28,39,0.04)] relative animate-fade-slide-up hover:-translate-y-2 transition-transform duration-300" style={{ animationDelay: `${i * 0.15}s` }}>
                     <span className="absolute top-4 right-6 text-[3rem] font-extrabold text-primary opacity-20">{step.num}</span>
                     <h3 className="text-xl font-bold text-on-surface mb-3 mt-4 pr-12">{step.title}</h3>
                     <p className="text-sm text-on-surface-variant leading-relaxed mb-6">{step.desc}</p>
                     <div className="w-[180px] h-32 bg-surface-container-high rounded-xl mx-auto border-4 border-surface overflow-hidden relative">
                        {/* Abstract representations of UI */}
                        <div className="absolute flex top-4 left-4 gap-2">
                           <span className="material-symbols-outlined text-primary/60">{step.icon}</span>
                           <div className="flex flex-col gap-1 mt-1">
                              <div className="w-16 h-2 rounded bg-surface-container-lowest/80"></div>
                              <div className="w-10 h-1.5 rounded bg-surface-container-lowest/50"></div>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* PRIVACY PROMISE */}
      <section id="privacy" className="py-[96px] px-12 bg-surface relative z-10 w-full flex flex-col items-center justify-center">
         <span className="material-symbols-outlined text-[64px] text-primary text-center block mb-6" style={{ fontVariationSettings: "'FILL' 0" }}>lock_open</span>
         <h2 className="text-[2rem] font-extrabold text-center text-on-surface max-w-[760px] mx-auto mb-8">
            Built for patients who deserve privacy.
         </h2>
         <div className="max-w-[760px] mx-auto space-y-6">
            <p className="text-base text-on-surface-variant leading-relaxed text-center">
               Neuros Health stores all your data with row-level security. That means only you can see your records — not us, not your pharmacy, not anyone.
            </p>
            <p className="text-base text-on-surface-variant leading-relaxed text-center">
               We don't run ads. We don't sell data. The app is free because healthy patients shouldn't pay a subscription tax to take their medication correctly.
            </p>
            <p className="text-base text-on-surface-variant leading-relaxed text-center">
               All data is stored in a New Zealand / Australia region server. You can export everything you've ever entered, or delete your account entirely, at any time.
            </p>
         </div>
         <div className="flex items-center justify-center gap-4 mt-10">
            <div className="bg-surface-container-low px-5 py-2.5 rounded-full flex gap-2 items-center">
               <span className="material-symbols-outlined text-[18px] text-primary" aria-hidden>lock</span><span className="text-sm font-semibold text-on-surface-variant">Zero data selling</span>
            </div>
            <div className="bg-surface-container-low px-5 py-2.5 rounded-full flex gap-2 items-center">
               <span className="material-symbols-outlined text-[18px] text-primary" aria-hidden>public</span><span className="text-sm font-semibold text-on-surface-variant">NZ/AU data region</span>
            </div>
         </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-[96px] px-12 text-center relative z-10 w-full" style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)" }}>
         <h2 className="text-[3rem] font-extrabold text-white leading-tight">Start your health journey today.</h2>
         <p className="text-xl text-white/85 mt-4 mb-10">Free forever. No credit card. No catch.</p>
         <Link href="/onboarding" className="inline-flex bg-white/95 text-primary font-bold h-[60px] px-10 rounded-full items-center justify-center hover:bg-white hover:shadow-lg transition-all active:scale-95 animate-scale-spring" style={{ animationDelay: "0.3s" }}>
            Create My Free Account &rarr;
         </Link>
         <p className="mt-5 text-sm text-white/80">
            Already have an account? <Link href="/login" className="text-white font-bold hover:underline">Sign in &rarr;</Link>
         </p>
      </section>

      {/* FOOTER */}
      <footer className="bg-on-surface py-[64px] px-12">
         <div className="max-w-7xl mx-auto grid grid-cols-4 gap-12">
            <div className="col-span-1">
               <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-inverse-on-surface text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>potted_plant</span>
                  <span className="font-extrabold text-lg text-inverse-on-surface tracking-tight">Neuros Health</span>
               </div>
               <p className="text-sm text-inverse-on-surface/70 mb-4">Your pharmacy companion.</p>
               <p className="text-sm text-inverse-on-surface/50">&copy; 2026 Neuros Health</p>
            </div>
            <div className="col-span-1 flex flex-col gap-3">
               <span className="font-bold text-inverse-on-surface mb-1">Product</span>
               <Link href="#features" className="text-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors">Features</Link>
               <Link href="#how-it-works" className="text-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors">How It Works</Link>
               <Link href="#pricing" className="text-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors">Pricing</Link>
               <Link href="#" className="text-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors">Download App</Link>
            </div>
            <div className="col-span-1 flex flex-col gap-3">
               <span className="font-bold text-inverse-on-surface mb-1">Legal</span>
               <Link href="#privacy" className="text-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors">Privacy Policy</Link>
               <Link href="#" className="text-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors">Terms of Use</Link>
               <Link href="#" className="text-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors">Data Export</Link>
               <Link href="#" className="text-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors">Delete Account</Link>
            </div>
            <div className="col-span-1 flex flex-col gap-3">
               <span className="font-bold text-inverse-on-surface mb-1">Support</span>
               <Link href="#" className="text-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors">Contact Pharmacy</Link>
               <a href="tel:0800611116" className="text-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors block">Healthline: 0800 611 116</a>
               <a href="tel:111" className="text-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors font-bold mt-2">Emergency: 111</a>
            </div>
         </div>
      </footer>
    </div>
  );
}
