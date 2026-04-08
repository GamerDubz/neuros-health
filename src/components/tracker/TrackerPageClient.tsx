"use client";

import { useAppStore } from "@/hooks/useAppStore";

export default function TrackerPage() {
  const { logs, medications, user } = useAppStore();

  const today = new Date();
  const todayKey = today.toISOString().split('T')[0];

  const past7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const adherenceData = past7Days.map(dateStr => {
    const logsForDate = logs.filter(l => l.dateStr === dateStr);
    const expected = medications.length;
    const percent = expected === 0 ? 0 : Math.min(100, Math.round((logsForDate.length / expected) * 100));
    return {
      dateStr,
      dayName: new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
      percent,
      isToday: dateStr === todayKey,
    };
  });

  const weeklyAvg = Math.round(adherenceData.reduce((sum, d) => sum + d.percent, 0) / adherenceData.length);

  return (
    <main className="flex flex-col gap-8 px-4 py-8 max-w-2xl mx-auto lg:max-w-none">

      <header>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight max-w-[10ch]">
          My <br />
          <span className="opacity-60">Progress.</span>
        </h1>
      </header>

      {/* Overview Stats */}
      <section className="grid grid-cols-2 gap-4">
        <div className="p-6 bg-surface-container-high border border-outline-variant rounded-3xl">
          <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Weekly Average</p>
          <p className="text-4xl text-primary font-extrabold mt-1">{weeklyAvg}%</p>
        </div>
        <div className="p-6 bg-surface-container-low rounded-3xl">
          <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Current Streak</p>
          <p className="text-4xl text-secondary font-extrabold mt-1">{user.streakDays} d</p>
        </div>
      </section>

      {/* Adherence Bar Chart */}
      <section>
        <div className="p-6 bg-surface-container-lowest border border-surface-container-high rounded-3xl">
          <h2 className="text-lg font-extrabold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
            Last 7 Days
          </h2>

          <div className="flex justify-around items-end h-[320px] gap-2 px-2 mt-8">
            {adherenceData.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-4">
                <div className="w-12 sm:w-14 lg:w-16 h-[260px] bg-surface-container-high rounded-4xl relative overflow-hidden shadow-inner">
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-4xl transition-[height] duration-500 ease-out"
                    style={{
                      height: `${d.percent}%`,
                      background: d.percent === 100
                        ? 'var(--color-primary)'
                        : d.percent > 0
                          ? 'var(--color-secondary-container)'
                          : 'transparent',
                    }}
                  />
                </div>
                <span className={`text-xs font-bold leading-none ${d.isToday ? "text-primary" : "text-on-surface-variant"}`}>
                  {d.dayName}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Today's Log */}
      <section>
        <h2 className="text-lg font-extrabold mb-6">Today&apos;s Log</h2>
        <div className="flex flex-col gap-4">
          {medications.length === 0 ? (
            <p className="text-sm text-on-surface-variant">No medications added yet.</p>
          ) : (
            medications.map((med) => {
              const isLogged = logs.some(l => l.dateStr === todayKey && l.medicationId === med.id);
              return (
                <div
                  key={med.id}
                  className="flex justify-between items-center px-6 py-4 bg-surface-container-lowest rounded-2xl"
                >
                  <div className="flex flex-col">
                    <span className="text-base font-extrabold text-on-surface">{med.name}</span>
                    <span className="text-sm font-semibold text-on-surface-variant">
                      Due {Array.isArray(med.time) ? med.time.join(", ") : med.time}
                    </span>
                  </div>
                  <span
                    className={`material-symbols-outlined text-2xl ${isLogged ? "text-primary" : "text-outline"}`}
                    style={{ fontVariationSettings: isLogged ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {isLogged ? "check_circle" : "radio_button_unchecked"}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </section>

    </main>
  );
}
