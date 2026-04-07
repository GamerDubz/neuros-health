"use client";

export default function Dashboard() {
  const medications = [
    { name: "Levothyroxine", dose: "100mcg", time: "08:30 AM", frequency: "Daily", type: "Pill", nextDose: true },
    { name: "Lisinopril", dose: "20mg", time: "10:15 PM", frequency: "Once daily", type: "Tablet" },
    { name: "Metformin", dose: "500mg", time: "01:00 PM", frequency: "With lunch", type: "Tablet" },
  ];

  return (
    <main className="container" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
      {/* Editorial Header */}
      <header style={{ marginBottom: '4rem' }}>
        <h1 style={{ 
          fontSize: 'var(--display-lg)', 
          lineHeight: '1.2', 
          maxWidth: '12ch' 
        }}>
          Medication <br/> 
          <span style={{ opacity: 0.6 }}>Schedule.</span>
        </h1>
      </header>

      {/* Surface Hierarchy: Nesting cards in a section group */}
      <section className="section-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: 'var(--title-md)', fontWeight: 700 }}>Active Protocols</h2>
          <span className="chip" style={{ 
            background: 'var(--surface-container-highest)', 
            color: 'var(--on-surface-variant)',
            fontSize: 'var(--label-md)'
          }}>
            {medications.length} Prescriptions
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {medications.map((med, idx) => (
            <div 
              key={idx} 
              className="card" 
              style={{ 
                marginBottom: 0,
                background: med.nextDose ? 'var(--secondary-container)' : 'var(--surface-container-lowest)',
                color: med.nextDose ? 'var(--on-secondary-container)' : 'var(--on-surface)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--title-lg)', fontWeight: 800 }}>{med.name}</h3>
                  <p style={{ 
                    fontSize: 'var(--body-lg)', 
                    marginTop: '0.25rem', 
                    opacity: med.nextDose ? 1 : 0.6 
                  }}>{med.dose} • {med.frequency}</p>
                </div>
                {med.nextDose && (
                   <div style={{ 
                     background: 'var(--primary)', 
                     color: 'white', 
                     padding: '0.5rem 1rem', 
                     borderRadius: 'var(--radius-full)', 
                     fontSize: 'var(--label-md)',
                     fontWeight: 700
                   }}>
                     Next Dose
                   </div>
                )}
              </div>
              
              {/* Interaction Details at the bottom of the card - glassmorphism hint if it was floating */}
              <div style={{ 
                marginTop: '1.5rem', 
                paddingTop: '1.5rem', 
                borderTop: med.nextDose ? '1px solid rgba(121, 93, 8, 0.1)' : '1px solid var(--surface-container-low)',
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <div style={{ 
                     width: '0.75rem', 
                     height: '0.75rem', 
                     borderRadius: 'var(--radius-full)', 
                     background: med.nextDose ? 'var(--primary)' : 'var(--surface-dim)' 
                   }}></div>
                   <span style={{ fontSize: 'var(--label-md)', fontWeight: 600 }}>{med.time}</span>
                </div>
                <button style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: med.nextDose ? 'var(--primary)' : 'var(--on-surface-variant)', 
                  fontWeight: 700, 
                  fontSize: 'var(--label-md)', 
                  cursor: 'pointer' 
                }}>
                  Refill Needed
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Global Navigation - Glassmorphism Demo */}
      <nav className="glass" style={{ 
        position: 'fixed', 
        bottom: '1rem', 
        left: '1rem', 
        right: '1rem', 
        padding: '1rem 2rem', 
        borderRadius: 'var(--radius-full)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{ color: 'var(--primary)', fontWeight: 800 }}>Health.</div>
        <div style={{ display: 'flex', gap: '2rem', fontSize: 'var(--label-md)', fontWeight: 600 }}>
          <span>Summary</span>
          <span style={{ color: 'var(--on-surface-variant)', opacity: 0.5 }}>Account</span>
        </div>
      </nav>
    </main>
  );
}
