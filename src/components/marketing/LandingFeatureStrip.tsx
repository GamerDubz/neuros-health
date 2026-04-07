const FEATURE_STRIP_ITEMS = [
  { icon: "medical_services", title: "Medication Tracking", sub: "Daily reminders + history" },
  { icon: "healing", title: "AI Health Guidance", sub: "Symptom checker built in" },
  { icon: "lock", title: "100% Private", sub: "Your data stays yours" },
  { icon: "forest", title: "Growth Rewards", sub: "Streaks, badges, your tree", fill: 1 },
  { icon: "local_pharmacy", title: "Pharmacy Connected", sub: "Direct pharmacist access" },
];

export function LandingFeatureStrip() {
  return (
    <section id="features" className="py-[48px] max-w-[960px] mx-auto px-8">
      <div className="flex justify-between items-center relative z-10">
        {FEATURE_STRIP_ITEMS.map((feature, index) => (
          <div
            key={feature.title}
            className="flex flex-col items-center text-center gap-3 animate-fade-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center">
              <span
                className="material-symbols-outlined text-[32px] text-primary"
                style={{ fontVariationSettings: `'FILL' ${feature.fill || 0}` }}
              >
                {feature.icon}
              </span>
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-on-surface leading-tight">
                {feature.title}
              </h3>
              <p className="text-[12px] text-on-surface-variant mt-1">
                {feature.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
