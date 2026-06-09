'use client'

import { HelpCircle } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

export function SimulationBanner() {
  const isCurrentlySimulated = useAppStore((s) => s.isCurrentlySimulated)
  const simulationMode = useAppStore((s) => s.simulationMode)
  const setSimulationMode = useAppStore((s) => s.setSimulationMode)
  const wallets = useAppStore((s) => s.wallets)

  const hasNoBalances = !wallets.length || wallets.every(w => Number(w.balance || 0) === 0)

  // When in live mode but account is empty/zero, show a subtle banner to go back to demo
  if (simulationMode === 'off' && hasNoBalances) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-r from-zinc-50 via-zinc-100 to-zinc-50 px-5 py-2 border-b border-zinc-200/80 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3 select-none">
          <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-500">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-200/60 text-zinc-500">
              <HelpCircle size={10} />
            </div>
            <span className="leading-tight">
              Showing empty live account.
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSimulationMode('auto')}
              className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-zinc-900 active:scale-95"
            >
              Demo Mode
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!isCurrentlySimulated) return null

  return (
    <div className="relative overflow-hidden px-5 py-2 ">
      {/* Background glow animation */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-transparent opacity-60" />

      <div className="mx-auto flex max-w-md items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-2 text-[11px] font-medium text-amber-800">
          {/* <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 animate-pulse">
            <Sparkles size={10} />
          </div> */}
          <span className="leading-tight">
            {simulationMode === 'forced' ? (
              <>
                <strong>Forced Demo:</strong> Seeded mock data active.
              </>
            ) : (
              <>
                {/* <strong>Demo Mode:</strong> Seeded mock data active (test account is empty). */}
              </>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setSimulationMode('off')}
            className="rounded-full bg-amber-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm shadow-amber-900/10 transition hover:bg-amber-700 active:scale-95"
          >
            Live Mode
          </button>
        </div>
      </div>
    </div>
  )
}
