import { EmergencyNumbers } from '@/lib/db/ailments'

export default function EmergencyFooter({
  emergencyNumbers,
}: {
  emergencyNumbers: EmergencyNumbers
}) {
  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 px-4 max-w-2xl mx-auto">
      <div className="rounded-2xl bg-error-container border-l-4 border-error p-4 shadow-[0_10px_40px_rgba(186,26,26,0.15)]">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-xl text-error" aria-hidden>
            warning
          </span>
          <p className="font-bold text-error text-sm">If symptoms are severe:</p>
        </div>
        <div className="flex gap-3">
          {emergencyNumbers?.phone_111 && (
            <a
              href="tel:111"
              className="flex-1 flex items-center justify-center gap-2 h-12
                         bg-error text-on-error rounded-full font-bold text-sm"
            >
              <span className="material-symbols-outlined text-lg" aria-hidden>call</span>
              Call 111
            </a>
          )}
          {emergencyNumbers?.healthline && (
            <a
              href={`tel:${emergencyNumbers.healthline.replace(/\s/g, '')}`}
              className="flex-1 flex items-center justify-center gap-2 h-12
                         bg-surface-container-lowest text-error border border-error
                         rounded-full font-bold text-xs text-center"
            >
              <span className="material-symbols-outlined text-base" aria-hidden>call</span>
              Healthline
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
