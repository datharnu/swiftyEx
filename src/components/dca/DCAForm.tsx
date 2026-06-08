'use client'

import { useState } from 'react'
import { AssetIcon } from '@/components/ui/AssetIcon'
import { useAppStore } from '@/store/useAppStore'
import { colors } from '@/lib/colors'
import { formatNgn } from '@/lib/portfolio'
import type { DCAplan } from '@/types'

const ASSETS = ['BTC', 'ETH', 'USDT'] as const
const FREQUENCIES = [
  { value: 'daily' as const, label: 'Daily' },
  { value: 'weekly' as const, label: 'Weekly' },
  { value: 'monthly' as const, label: 'Monthly' },
]

interface DCAFormProps {
  onSuccess: () => void
  onClose: () => void
}

function getNextRun(frequency: DCAplan['frequency']): string {
  const now = new Date()
  if (frequency === 'daily') now.setDate(now.getDate() + 1)
  else if (frequency === 'weekly') now.setDate(now.getDate() + 7)
  else now.setMonth(now.getMonth() + 1)
  return now.toISOString()
}

export function DCAForm({ onSuccess, onClose }: DCAFormProps) {
  const addDCAPlan = useAppStore((s) => s.addDCAPlan)
  const [asset, setAsset] = useState<string>('BTC')
  const [amount, setAmount] = useState('')
  const [frequency, setFrequency] = useState<DCAplan['frequency']>('weekly')
  const [totalBuys, setTotalBuys] = useState('12')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit() {
    const amountNum = Number(amount)
    const totalNum = Number(totalBuys)
    if (!amount || Number.isNaN(amountNum) || Number.isNaN(totalNum)) return

    addDCAPlan({
      id: crypto.randomUUID(),
      asset,
      amount_ngn: amountNum,
      frequency,
      total_buys: totalNum,
      completed_buys: 0,
      next_run: getNextRun(frequency),
      active: true,
    })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <div
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: `${colors.gold}33` }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
            stroke={colors.ink} strokeWidth="2.5" strokeLinecap="round"
            strokeLinejoin="round" aria-hidden>
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="text-lg font-bold" style={{ color: colors.ink }}>DCA plan created!</h3>
        <p className="mt-2 text-sm" style={{ color: `${colors.ink}66` }}>
          Buying <span className="font-semibold" style={{ color: colors.ink }}>{asset}</span> with{' '}
          <span className="font-semibold" style={{ color: colors.ink }}>{formatNgn(Number(amount))}</span>{' '}
          {FREQUENCIES.find((f) => f.value === frequency)?.label.toLowerCase()}
        </p>
        <button
          type="button"
          onClick={() => { onSuccess(); onClose() }}
          className="mt-6 w-full rounded-xl py-3 text-sm font-semibold transition active:scale-[0.98]"
          style={{ border: `1px solid ${colors.ink}1A`, color: colors.ink }}
        >
          Done
        </button>
      </div>
    )
  }

  return (
    <>
      <h2 className="text-[17px] font-bold" style={{ color: colors.ink }}>Set up DCA</h2>
      <p className="mb-5 mt-1 text-sm" style={{ color: `${colors.ink}66` }}>
        Automate recurring buys in Naira
      </p>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: `${colors.ink}44` }}>
        Asset
      </p>
      <div className="mb-4 flex gap-2">
        {ASSETS.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAsset(a)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition"
            style={
              asset === a
                ? { backgroundColor: `${colors.gold}33`, color: colors.ink, boxShadow: `inset 0 0 0 1px ${colors.gold}` }
                : { backgroundColor: `${colors.ink}08`, color: `${colors.ink}66` }
            }
          >
            <AssetIcon asset={a} size={20} />
            {a}
          </button>
        ))}
      </div>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: `${colors.ink}44` }}>
        Amount per buy (NGN)
      </p>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="e.g. 5000"
        className="mb-4 w-full rounded-xl border px-3 py-2.5 font-mono text-sm outline-none"
        style={{ borderColor: `${colors.ink}14`, backgroundColor: `${colors.ink}06`, color: colors.ink }}
      />

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: `${colors.ink}44` }}>
        Frequency
      </p>
      <div className="mb-4 flex gap-2">
        {FREQUENCIES.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFrequency(f.value)}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition"
            style={
              frequency === f.value
                ? { backgroundColor: `${colors.blue}14`, color: colors.blue, boxShadow: `inset 0 0 0 1px ${colors.blue}55` }
                : { backgroundColor: `${colors.ink}08`, color: `${colors.ink}66` }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: `${colors.ink}44` }}>
        Total planned buys
      </p>
      <input
        type="number"
        value={totalBuys}
        onChange={(e) => setTotalBuys(e.target.value)}
        placeholder="e.g. 12"
        className="mb-5 w-full rounded-xl border px-3 py-2.5 font-mono text-sm outline-none"
        style={{ borderColor: `${colors.ink}14`, backgroundColor: `${colors.ink}06`, color: colors.ink }}
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!amount || !totalBuys}
        className="w-full rounded-xl py-3.5 text-sm font-bold text-white transition disabled:opacity-40 active:scale-[0.98]"
        style={{ backgroundColor: colors.ink }}
      >
        Start DCA plan
      </button>
    </>
  )
}
