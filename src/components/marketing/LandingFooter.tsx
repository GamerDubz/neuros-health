import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="bg-on-surface py-[64px] px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-12">
        <div className="col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="material-symbols-outlined text-inverse-on-surface text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              potted_plant
            </span>
            <span className="font-extrabold text-lg text-inverse-on-surface tracking-tight">
              Neuros Health
            </span>
          </div>
          <p className="text-sm text-inverse-on-surface/70 mb-4">
            Your pharmacy companion.
          </p>
          <p className="text-sm text-inverse-on-surface/50">
            &copy; 2026 Neuros Health
          </p>
        </div>
        <div className="col-span-1 flex flex-col gap-3">
          <span className="font-bold text-inverse-on-surface mb-1">Product</span>
          <Link
            href="#features"
            className="text-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="#pricing"
            className="text-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#"
            className="text-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors"
          >
            Download App
          </Link>
        </div>
        <div className="col-span-1 flex flex-col gap-3">
          <span className="font-bold text-inverse-on-surface mb-1">Legal</span>
          <Link
            href="#privacy"
            className="text-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors"
          >
            Terms of Use
          </Link>
          <Link
            href="#"
            className="text-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors"
          >
            Data Export
          </Link>
          <Link
            href="#"
            className="text-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors"
          >
            Delete Account
          </Link>
        </div>
        <div className="col-span-1 flex flex-col gap-3">
          <span className="font-bold text-inverse-on-surface mb-1">Support</span>
          <Link
            href="#"
            className="text-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors"
          >
            Contact Pharmacy
          </Link>
          <a
            href="tel:0800611116"
            className="text-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors block"
          >
            Healthline: 0800 611 116
          </a>
          <a
            href="tel:111"
            className="text-sm text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors font-bold mt-2"
          >
            Emergency: 111
          </a>
        </div>
      </div>
    </footer>
  );
}
