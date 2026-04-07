const HOW_IT_WORKS_STEPS = [
  {
    num: "01",
    title: "Add your medications",
    desc: "Search from thousands of drugs. Set your doses, times, and get smart reminders that actually work.",
    icon: "pill",
  },
  {
    num: "02",
    title: "Track every day",
    desc: "Mark doses taken. Watch your health tree grow. Earn badges for streaks that would make your pharmacist proud.",
    icon: "task_alt",
  },
  {
    num: "03",
    title: "Get guidance when you need it",
    desc: "Describe your symptoms and get AI-powered triage. Know when to self-care, when to call Healthline, when to call 111.",
    icon: "support_agent",
  },
];

export function LandingHowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-surface-container-low py-[96px] w-full">
      <div className="max-w-7xl mx-auto px-16 relative z-10">
        <p className="text-xs font-bold uppercase tracking-widest text-primary text-center mb-4">
          How It Works
        </p>
        <h2 className="text-[2.5rem] font-extrabold tracking-tight text-center text-on-surface max-w-[560px] mx-auto mb-16">
          Three steps to feeling supported.
        </h2>

        <div className="grid grid-cols-3 gap-8">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <div
              key={step.num}
              className="bg-surface-container-lowest p-8 rounded-[1.5rem] shadow-[0_10px_40px_rgba(21,28,39,0.04)] relative animate-fade-slide-up hover:-translate-y-2 transition-transform duration-300"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <span className="absolute top-4 right-6 text-[3rem] font-extrabold text-primary opacity-20">
                {step.num}
              </span>
              <h3 className="text-xl font-bold text-on-surface mb-3 mt-4 pr-12">
                {step.title}
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                {step.desc}
              </p>
              <div className="w-[180px] h-32 bg-surface-container-high rounded-xl mx-auto border-4 border-surface overflow-hidden relative">
                <div className="absolute flex top-4 left-4 gap-2">
                  <span className="material-symbols-outlined text-primary/60">
                    {step.icon}
                  </span>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="w-16 h-2 rounded bg-surface-container-lowest/80" />
                    <div className="w-10 h-1.5 rounded bg-surface-container-lowest/50" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
