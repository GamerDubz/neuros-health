export function LandingPrivacySection() {
  return (
    <section
      id="privacy"
      className="py-[96px] px-12 bg-surface relative z-10 w-full flex flex-col items-center justify-center"
    >
      <span
        className="material-symbols-outlined text-[64px] text-primary text-center block mb-6"
        style={{ fontVariationSettings: "'FILL' 0" }}
      >
        lock_open
      </span>
      <h2 className="text-[2rem] font-extrabold text-center text-on-surface max-w-[760px] mx-auto mb-8">
        Built for patients who deserve privacy.
      </h2>
      <div className="max-w-[760px] mx-auto space-y-6">
        <p className="text-base text-on-surface-variant leading-relaxed text-center">
          Neuros Health stores all your data with row-level security. That means
          only you can see your records — not us, not your pharmacy, not anyone.
        </p>
        <p className="text-base text-on-surface-variant leading-relaxed text-center">
          We don&apos;t run ads. We don&apos;t sell data. The app is free because
          healthy patients shouldn&apos;t pay a subscription tax to take their
          medication correctly.
        </p>
        <p className="text-base text-on-surface-variant leading-relaxed text-center">
          All data is stored in a New Zealand / Australia region server. You can
          export everything you&apos;ve ever entered, or delete your account
          entirely, at any time.
        </p>
      </div>
      <div className="flex items-center justify-center gap-4 mt-10">
        <div className="bg-surface-container-low px-5 py-2.5 rounded-full flex gap-2 items-center">
          <span
            className="material-symbols-outlined text-[18px] text-primary"
            aria-hidden
          >
            lock
          </span>
          <span className="text-sm font-semibold text-on-surface-variant">
            Zero data selling
          </span>
        </div>
        <div className="bg-surface-container-low px-5 py-2.5 rounded-full flex gap-2 items-center">
          <span
            className="material-symbols-outlined text-[18px] text-primary"
            aria-hidden
          >
            public
          </span>
          <span className="text-sm font-semibold text-on-surface-variant">
            NZ/AU data region
          </span>
        </div>
      </div>
    </section>
  );
}
