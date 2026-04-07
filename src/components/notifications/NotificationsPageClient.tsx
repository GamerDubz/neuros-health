"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NotificationsPage() {
  const router = useRouter();

  const notifications = [
    {
      id: 1,
      type: "reminder",
      group: "Today",
      title: "Time for your Sertraline",
      time: "8:00 AM",
      read: false,
    },
    {
      id: 2,
      type: "taken",
      group: "Today",
      title: "Sertraline dose logged",
      time: "8:05 AM",
      read: true,
    },
    {
      id: 3,
      type: "warning",
      group: "Yesterday",
      title: "Missed dose: Atorvastatin",
      time: "9:00 PM",
      read: true,
    },
    {
      id: 4,
      type: "reminder",
      group: "Yesterday",
      title: "Refill needed soon",
      time: "10:00 AM",
      read: true,
    }
  ];

  // Group notifications
  const grouped = notifications.reduce((acc: any, curr) => {
    (acc[curr.group] = acc[curr.group] || []).push(curr);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-surface md:p-8">
      
      {/* Mobile Header (Hidden on Desktop because desktop uses drop-down panel for notifications) */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-lg px-6 py-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full text-primary active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h1 className="font-bold text-lg text-teal-800 tracking-tight">Notifications</h1>
        </div>
        <button className="text-primary text-sm font-semibold active:opacity-50 transition-opacity">
          Mark all read
        </button>
      </header>

      {/* Main Container - Normally Notifications are a Dropdown on Desktop, but if navigated directly here, we show a centered card */}
      <div className="pt-24 pb-36 px-6 max-w-lg mx-auto md:pt-12 md:pb-12 md:bg-surface-container-lowest md:rounded-3xl md:shadow-[0_10px_40px_rgba(21,28,39,0.08)]">
         
         <div className="hidden md:flex justify-between items-center mb-8 px-6 pt-6">
            <h1 className="font-extrabold text-3xl tracking-tight text-on-surface">Notifications</h1>
            <button className="text-primary text-sm font-semibold hover:underline bg-primary/10 px-4 py-2 rounded-full">
              Mark all read
            </button>
         </div>

         <div className="md:px-6">
           {Object.entries(grouped).map(([group, notifs]: [string, any]) => (
             <div key={group} className="mb-6 animate-fade-in">
                <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3 pl-2">
                  {group}
                </h2>
                <div className="space-y-3">
                  {notifs.map((n: any) => (
                    <div 
                      key={n.id} 
                      className={`bg-surface-container-lowest md:bg-surface-container-low p-4 rounded-2xl flex items-start gap-4 shadow-[0_10px_40px_rgba(21,28,39,0.04)] md:shadow-none transition-all cursor-pointer active:scale-[0.98] ${!n.read ? 'border-l-4 border-primary' : ''}`}
                    >
                       <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                          n.type === 'reminder' ? 'bg-primary-fixed text-primary' :
                          n.type === 'taken' ? 'bg-tertiary-fixed/60 text-tertiary' :
                          n.type === 'warning' ? 'bg-error-container text-error' :
                          'bg-surface-container text-on-surface-variant'
                       }`}>
                         <span className="material-symbols-outlined">
                            {n.type === 'reminder' ? 'schedule' : n.type === 'taken' ? 'check_circle' : 'warning'}
                         </span>
                       </div>
                       
                       <div className="flex-1 pt-1">
                          <h3 className={`text-sm ${!n.read ? 'font-bold text-on-surface' : 'font-medium text-on-surface-variant'}`}>
                            {n.title}
                          </h3>
                          <p className={`text-xs mt-1 ${!n.read ? 'text-primary font-semibold' : 'text-outline/80'}`}>
                            {n.time}
                          </p>
                       </div>

                       {!n.read && (
                         <div className="w-2.5 h-2.5 bg-primary rounded-full mt-2 shrink-0 animate-pulse"></div>
                       )}
                    </div>
                  ))}
                </div>
             </div>
           ))}
         </div>
         
         {notifications.length === 0 && (
           <div className="py-20 flex flex-col items-center text-center">
             <div className="w-24 h-24 bg-surface-container rounded-[2rem] flex items-center justify-center mb-6">
               <span className="material-symbols-outlined text-[40px] text-outline/40">notifications_paused</span>
             </div>
             <p className="font-bold text-lg text-on-surface">You're all caught up</p>
             <p className="text-sm text-on-surface-variant mt-2 max-w-[200px]">We'll notify you when it's time for your next dose.</p>
           </div>
         )}
      </div>
    </div>
  );
}
