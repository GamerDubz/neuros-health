"use client";

import { useAppStore } from "@/hooks/useAppStore";
import { UserCircle, Shield, Download, Trash2, Crown, Bell } from "lucide-react";

export default function ProfilePage() {
  const { user, updateUser } = useAppStore();

  return (
    <main className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      <header style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '4rem', height: '4rem', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-full)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <UserCircle size={40} />
        </div>
        <div>
          <h1 style={{ fontSize: 'var(--title-lg)', fontWeight: 800 }}>{user.name}</h1>
          <p style={{ color: 'var(--on-surface-variant)', fontWeight: 600 }}>ID: 9812-NZ-HP</p>
        </div>
      </header>

      {/* Account Info */}
      <section className="section-group" style={{ margin: 0 }}>
        <h2 style={{ fontSize: 'var(--label-md)', fontWeight: 800, textTransform: 'uppercase', color: 'var(--on-surface-variant)', marginBottom: '1rem' }}>Account Controls</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          
          <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 0 }}>
            <span style={{ fontWeight: 800 }}>Subscription Status</span>
            {user.isPremium ? (
               <span className="chip" style={{ background: 'var(--primary)', color: 'white' }}>Premium</span>
            ) : (
               <span className="chip" style={{ background: 'var(--surface-dim)', color: 'var(--on-surface-variant)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                 <Crown size={14} /> Basic
               </span>
            )}
          </div>

          <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 0 }}>
            <span style={{ fontWeight: 800 }}>Notification Reminders</span>
            <button 
               onClick={() => updateUser({ remindersEnabled: !user.remindersEnabled })}
               style={{ 
                  background: user.remindersEnabled ? 'var(--primary)' : 'var(--surface-dim)', 
                  border: 'none', 
                  borderRadius: 'var(--radius-full)', 
                  width: '44px', 
                  height: '24px', 
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background 0.3s'
               }}>
               <div style={{
                  position: 'absolute',
                  top: '2px',
                  left: user.remindersEnabled ? '22px' : '2px',
                  width: '20px',
                  height: '20px',
                  background: 'white',
                  borderRadius: '50%',
                  transition: 'left 0.3s'
               }} />
            </button>
          </div>

        </div>
      </section>

      {/* Health Profile */}
      <section className="section-group" style={{ margin: 0 }}>
        <h2 style={{ fontSize: 'var(--label-md)', fontWeight: 800, textTransform: 'uppercase', color: 'var(--on-surface-variant)', marginBottom: '1rem' }}>Health Profile</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
               <span style={{ fontWeight: 800 }}>Chronic Conditions</span>
               <span style={{ color: 'var(--primary)', fontWeight: 800 }}>Add</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
               {user.conditions.length > 0 ? user.conditions.map((c, i) => (
                 <span key={i} className="chip" style={{ background: 'var(--surface-container-highest)', color: 'var(--on-surface)' }}>{c}</span>
               )) : <span style={{ color: 'var(--on-surface-variant)', fontSize: '14px' }}>None logged</span>}
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
               <span style={{ fontWeight: 800, color: '#b91c1c' }}>Allergies</span>
               <span style={{ color: 'var(--primary)', fontWeight: 800 }}>Add</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
               {user.allergies.length > 0 ? user.allergies.map((a, i) => (
                 <span key={i} className="chip" style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fca5a5' }}>{a}</span>
               )) : <span style={{ color: 'var(--on-surface-variant)', fontSize: '14px' }}>None logged</span>}
            </div>
          </div>

        </div>
      </section>

      {/* Data Privacy & GDPR */}
      <section className="section-group" style={{ margin: 0 }}>
        <h2 style={{ fontSize: 'var(--label-md)', fontWeight: 800, textTransform: 'uppercase', color: 'var(--on-surface-variant)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           <Shield size={16} /> Data Privacy
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <button style={{ 
            width: '100%', 
            padding: '1.25rem', 
            background: 'var(--surface-container-lowest)', 
            border: '1.5px solid var(--outline-variant)', 
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 800,
            cursor: 'pointer'
          }}>
            <Download size={20} /> Export Health Data (PDF)
          </button>

          <button style={{ 
            width: '100%', 
            padding: '1.25rem', 
            background: '#fef2f2', 
            color: '#dc2626',
            border: 'none', 
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 800,
            cursor: 'pointer'
          }}>
            <Trash2 size={20} /> Delete Account
          </button>

        </div>
        <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--on-surface-variant)', textAlign: 'center' }}>
          All data is self-reported. We do not integrate with national health portfolios to ensure absolute patient privacy.
        </p>
      </section>
      
    </main>
  );
}
