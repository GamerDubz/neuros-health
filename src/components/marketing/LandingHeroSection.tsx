import Link from "next/link";

const TRUSTED_INITIALS = ["JD", "AM", "KS", "RK"];

export function LandingHeroSection() {
  return (
    <section className="min-h-screen flex items-center pt-24 pb-16 relative">
      <div className="max-w-7xl mx-auto px-16 w-full grid grid-cols-2 gap-16 items-center">
        <div className="flex flex-col justify-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low w-fit animate-fade-slide-down"
            style={{ animationDelay: "0.1s" }}
          >
            <span
              className="material-symbols-outlined text-[16px] text-primary"
              aria-hidden
            >
              spa
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Free to use · Private by design
            </span>
          </div>

          <h1 className="text-[4rem] font-extrabold leading-[1.05] tracking-tight mt-8 text-on-surface">
            Your health,
            <br />
            <span className="text-primary">companion.</span>
          </h1>

          <p
            className="text-lg text-on-surface-variant leading-[1.7] max-w-[480px] mt-6 animate-fade-slide-up"
            style={{ animationDelay: "0.7s" }}
          >
            Neuros Health is the pharmacy companion app built for people managing
            chronic conditions and long-term medications. Private, intelligent,
            and designed to feel like support — not surveillance.
          </p>

          <div
            className="flex items-center gap-5 mt-10 animate-fade-slide-up"
            style={{ animationDelay: "0.9s" }}
          >
            <Link
              href="/onboarding"
              className="h-[56px] px-8 rounded-full font-bold text-white text-base flex items-center justify-center gradient-primary shadow-btn hover:brightness-105 active:scale-95 transition-all"
            >
              Get Started Free &rarr;
            </Link>
            <button className="flex items-center gap-2 text-primary font-semibold text-sm hover:opacity-80 transition-opacity">
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                play_circle
              </span>
              Watch how it works
            </button>
          </div>

          <div
            className="flex items-center gap-3 mt-8 animate-fade-in"
            style={{ animationDelay: "1.1s" }}
          >
            <div className="flex rtl:space-x-reverse -space-x-2">
              {TRUSTED_INITIALS.map((initials) => (
                <div
                  key={initials}
                  className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed font-bold text-xs flex items-center justify-center border-2 border-surface"
                >
                  {initials}
                </div>
              ))}
            </div>
            <span className="text-sm text-on-surface-variant">
              Trusted by 2,400+ patients managing chronic conditions
            </span>
          </div>
        </div>

        <div className="relative flex items-center justify-center h-[600px]">
          <div
            className="w-[300px] h-[600px] rounded-[3rem] bg-surface-container-lowest shadow-[0_40px_80px_rgba(21,28,39,0.12)] border-8 border-surface-container rotate-[2deg] overflow-hidden flex flex-col relative z-10 animate-scale-spring"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="px-5 py-4 flex justify-between items-center bg-surface/80 backdrop-blur-md z-20 sticky top-0">
              <div className="w-24 h-4 rounded-full bg-surface-container" />
              <div className="w-8 h-8 rounded-full bg-primary-fixed" />
            </div>
            <div className="p-5 flex-1 relative bg-surface">
              <div className="w-32 h-6 rounded bg-surface-container mb-2" />
              <div className="w-20 h-3 rounded bg-surface-container-low mb-6" />

              <div className="h-48 rounded-2xl bg-gradient-to-br from-primary-fixed to-surface-container-low p-4 flex flex-col items-center justify-center relative mb-6">
                <div className="absolute top-3 right-3 w-16 h-5 rounded-full bg-white/50 backdrop-blur-sm" />
                <span
                  className="material-symbols-outlined text-[80px] text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  forest
                </span>
                <div className="w-24 h-4 rounded bg-primary-container/20 mt-4" />
              </div>

              <div className="w-24 h-4 rounded bg-surface-container mb-4" />
              <div className="h-16 rounded-xl bg-surface-container-lowest shadow-sm mb-3" />
              <div className="h-16 rounded-xl bg-surface-container-lowest shadow-sm" />
            </div>
            <div className="h-16 bg-white flex justify-around items-center border-t border-surface-container-low sticky bottom-0 z-20">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="w-6 h-6 rounded-md bg-surface-container-low" />
              ))}
            </div>
          </div>

          <div
            className="absolute top-[80px] left-[-20px] bg-white/85 backdrop-blur-md px-4 py-2 rounded-2xl shadow-[0_20px_60px_rgba(21,28,39,0.10)] font-bold text-sm text-on-surface z-20 animate-scale-spring animate-float-badge flex items-center gap-2"
            style={{ animationDelay: "0.9s" }}
          >
            <span
              className="material-symbols-outlined text-[18px] text-[#f97316]"
              style={{ fontVariationSettings: "'FILL' 1" }}
              aria-hidden
            >
              local_fire_department
            </span>
            12 Day Streak
          </div>

          <div
            className="absolute bottom-[60px] right-[-20px] bg-white/85 backdrop-blur-md px-4 py-2 rounded-2xl shadow-[0_20px_60px_rgba(21,28,39,0.10)] font-bold text-sm text-on-surface z-20 animate-scale-spring flex items-center gap-2"
            style={{
              animationDelay: "1.1s",
              animation: "scaleSpring 0.6s ease 1.1s both, floatBadge 4s ease-in-out infinite 2s",
            }}
          >
            <span
              className="material-symbols-outlined text-[18px] text-tertiary"
              style={{ fontVariationSettings: "'FILL' 1" }}
              aria-hidden
            >
              check_circle
            </span>
            Sertraline taken · 8:00 AM
          </div>

          <div
            className="absolute top-[160px] right-[-40px] bg-white/85 backdrop-blur-md px-4 py-2 rounded-2xl shadow-[0_20px_60px_rgba(21,28,39,0.10)] font-bold text-sm text-on-surface z-20 animate-scale-spring flex items-center gap-2"
            style={{ animationDelay: "1.3s" }}
          >
            <span
              className="material-symbols-outlined text-tertiary text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            87% adherence this month
          </div>
        </div>
      </div>
    </section>
  );
}
