'use client'

import { useState } from 'react'
import { colors } from '@/lib/colors'
import { formatNgn } from '@/lib/portfolio'
interface TotalValueProps {
  totalNgn: number
  loading?: boolean
}

function EyeToggle({ hidden, onToggle }: { hidden: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex h-8 w-8 items-center justify-center rounded-full transition"
      style={{ backgroundColor: `${colors.ink}0D`, color: `${colors.ink}80` }}
      aria-label={hidden ? 'Show balance' : 'Hide balance'}
    >
      {hidden ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  )
}

export function TotalValue({ totalNgn, loading }: TotalValueProps) {
  const [hidden, setHidden] = useState(false)

  return (
    <div
      className="rounded-2xl border px-5 py-4"
      style={{
        borderColor: `${colors.blue}22`,
        backgroundColor: `${colors.blue}08`,
      }}
    >
      <p
        className="text-xs font-medium uppercase tracking-[0.12em]"
        style={{ color: `${colors.ink}66` }}
      >
        Total Portfolio
      </p>
      <div className="mt-2 flex items-center gap-3">
        {loading ? (
          <div
            className="h-9 w-40 animate-pulse rounded-lg"
            style={{ backgroundColor: `${colors.ink}14` }}
          />
        ) : hidden ? (
          <span
            className="font-mono text-3xl font-bold tracking-[6px]"
            style={{ color: colors.ink }}
          >
            ••••••
          </span>
        ) : (
          <span className="font-mono text-3xl font-bold" style={{ color: colors.ink }}>
            {formatNgn(totalNgn)}
          </span>
        )}
        <EyeToggle hidden={hidden} onToggle={() => setHidden((v) => !v)} />
      </div>
      <p className="mt-1 text-xs" style={{ color: `${colors.ink}55` }}>
        All wallets converted at current sell rates
      </p>
    </div>
  )
}
