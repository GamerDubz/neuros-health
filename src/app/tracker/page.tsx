"use client";

import { useStore } from "@/lib/store";
import { Calendar as CalendarIcon, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";

export default function TrackerPage() {
    const { logs, medications } = useStore();

    // Create a mock 7-day history for visualization
    const today = new Date();
    const past7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
    });

    const adherenceData = past7Days.map(dateStr => {
        const logsForDate = logs.filter((l: any) => l.dateStr === dateStr);
        const expected = medications.length;
        const isToday = dateStr === today.toISOString().split('T')[0];

        // For mock purposes, dates before today might have random or full adherence
        const percent = expected === 0 ? 0 : Math.round((logsForDate.length / expected) * 100);

        return {
            dateStr,
            dayName: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
            percent,
            isToday
        };
    });

    return (
        <main className="container mx-auto px-4 py-8" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{ marginTop: '1rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: '1.2', letterSpacing: '-0.02em', maxWidth: '10ch' }}>
                    My <br />
                    <span style={{ opacity: 0.6 }}>Progress.</span>
                </h1>
            </header>

            {/* Overview Stats */}
            <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="card" style={{ padding: '1.5rem', background: 'var(--color-surface-container-high)', border: '1px solid var(--color-outline-variant)', borderRadius: '1.5rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Weekly Average</p>
                    <p style={{ fontSize: '2.5rem', color: 'var(--color-primary)', fontWeight: 800, marginTop: '0.25rem' }}>
                        {adherenceData[6].percent}%
                    </p>
                </div>
                <div className="card" style={{ padding: '1.5rem', background: 'var(--color-surface-container-low)', borderRadius: '1.5rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Streak</p>
                    <p style={{ fontSize: '2.5rem', color: 'var(--color-secondary)', fontWeight: 800, marginTop: '0.25rem' }}>
                        3 d
                    </p>
                </div>
            </section>

            {/* Adherence Graph (Mock Calendar) */}
            <section style={{ margin: 0 }}>
                <div className="card" style={{ padding: '1.5rem', background: 'var(--color-surface-container-lowest)', borderRadius: '1.5rem', border: '1px solid var(--color-surface-container-high)' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CalendarIcon size={20} /> Last 7 Days
                    </h2>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '120px', gap: '0.5rem' }}>
                        {adherenceData.map((d, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                                <div style={{
                                    width: '100%',
                                    height: '100px',
                                    background: 'var(--color-surface-container-high)',
                                    borderRadius: '9999px',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: `${d.percent}%`,
                                        background: d.percent === 100 ? 'var(--color-primary)' : (d.percent > 0 ? 'var(--color-secondary-container)' : 'transparent'),
                                        borderRadius: '9999px',
                                        transition: 'height 0.5s ease-out'
                                    }}></div>
                                </div>
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: d.isToday ? 'var(--color-primary)' : 'var(--color-on-surface-variant)' }}>
                                    {d.dayName}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Today's Log History */}
            <section style={{ margin: 0 }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1.5rem' }}>Today's Log</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {medications.map((med: any) => {
                        const isLogged = logs.some((l: any) => l.dateStr === adherenceData[6].dateStr && l.medicationId === med.id);
                        return (
                            <div key={med.id} className="card" style={{
                                margin: 0,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem 1.5rem',
                                borderLeft: isLogged ? '4px solid var(--color-primary)' : '4px solid var(--color-surface-dim)',
                                background: 'var(--color-surface-container-lowest)',
                                borderRadius: '1rem'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '1rem', fontWeight: 800 }}>{med.name}</span>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--color-on-surface-variant)', fontWeight: 600 }}>Due {Array.isArray(med.time) ? med.time.join(", ") : med.time}</span>
                                </div>
                                <div>
                                    {isLogged ? <CheckCircle2 color="var(--color-primary)" size={24} /> : <XCircle color="var(--color-surface-dim)" size={24} />}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

        </main>
    );
}
