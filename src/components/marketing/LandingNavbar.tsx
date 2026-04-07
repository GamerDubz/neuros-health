import Link from "next/link";

export function LandingNavbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/88 backdrop-blur-xl h-[72px] border-b border-transparent">
      <div className="max-w-7xl mx-auto px-12 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-[28px] text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            potted_plant
          </span>
          <span className="font-extrabold text-xl text-primary tracking-tight">
            Neuros Health
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors duration-150"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors duration-150"
          >
            How It Works
          </Link>
          <Link
            href="#privacy"
            className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors duration-150"
          >
            Privacy
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors duration-150"
          >
            Pricing
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-primary px-4 py-2 hover:bg-surface-container-low rounded-full transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/onboarding"
            className="h-[44px] px-6 rounded-full font-bold text-white text-[14px] flex items-center justify-center gradient-primary shadow-btn hover:brightness-105 active:scale-95 transition-all"
          >
            Get Started Free &rarr;
          </Link>
        </div>
      </div>
    </nav>
  );
}
