import Link from "next/link";

export function LandingFinalCtaSection() {
  return (
    <section
      className="py-[96px] px-12 text-center relative z-10 w-full"
      style={{
        background:
          "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)",
      }}
    >
      <h2 className="text-[3rem] font-extrabold text-white leading-tight">
        Start your health journey today.
      </h2>
      <p className="text-xl text-white/85 mt-4 mb-10">
        Free forever. No credit card. No catch.
      </p>
      <Link
        href="/onboarding"
        className="inline-flex bg-white/95 text-primary font-bold h-[60px] px-10 rounded-full items-center justify-center hover:bg-white hover:shadow-lg transition-all active:scale-95 animate-scale-spring"
        style={{ animationDelay: "0.3s" }}
      >
        Create My Free Account &rarr;
      </Link>
      <p className="mt-5 text-sm text-white/80">
        Already have an account?{" "}
        <Link href="/login" className="text-white font-bold hover:underline">
          Sign in &rarr;
        </Link>
      </p>
    </section>
  );
}
