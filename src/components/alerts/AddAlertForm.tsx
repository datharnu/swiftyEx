'use client'

import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { colors } from '@/lib/colors'
import type { Rates } from '@/types'

type AlertType = 'ngn' | 'crypto'
type Direction = 'above' | 'below'

const NGN_ASSETS = ['USD / NGN'] as const
const CRYPTO_ASSETS = ['BTC / USDT', 'ETH / USDT'] as const

interface AddAlertFormProps {
  rates: Rates
  onSuccess: () => void
  onClose: () => void
}

export function AddAlertForm({ rates, onSuccess, onClose }: AddAlertFormProps) {
  const addAlert = useAppStore((s) => s.addAlert)
  const [type, setType] = useState<AlertType>('ngn')
  const [asset, setAsset] = useState('USD / NGN')
  const [direction, setDirection] = useState<Direction>('above')
  const [target, setTarget] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const currentValue = type === 'ngn'
    ? Number(rates.USDT.buy)
    : asset.startsWith('BTC')
      ? Number(rates.BTC.buy)
      : Number(rates.ETH.buy)

  const currentRate = type === 'ngn'
    ? `₦${currentValue.toLocaleString('en-NG')}`
    : `$${currentValue.toLocaleString('en-US')}`

  function handleTypeChange(t: AlertType) {
    setType(t)
    setAsset(t === 'ngn' ? 'USD / NGN' : 'BTC / USDT')
  }

  function handleSubmit() {
    const targetNum = Number(target)
    if (!target || Number.isNaN(targetNum)) return

    addAlert({
      id: crypto.randomUUID(),
      asset: type === 'ngn' ? 'USD/NGN' : asset.split('/')[0].trim(),
      direction,
      target: targetNum,
      current: currentValue,
      active: true,
      type: type === 'ngn' ? 'naira_rate' : 'crypto',
    })
    setSubmitted(true)
  }

  const formattedTarget = target
    ? type === 'ngn'
      ? `₦${Number(target).toLocaleString('en-NG')}`
      : `$${Number(target).toLocaleString('en-US')}`
    : ''

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <div
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: `${colors.teal}18` }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
            stroke={colors.teal} strokeWidth="2.5" strokeLinecap="round"
            strokeLinejoin="round" aria-hidden>
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="text-lg font-bold" style={{ color: colors.ink }}>Alert set!</h3>
        <p className="mt-2 text-sm" style={{ color: `${colors.ink}66` }}>
          You&apos;ll be notified when{' '}
          <span className="font-semibold" style={{ color: colors.ink }}>{asset}</span>{' '}
          {direction === 'above' ? 'goes above' : 'falls below'}{' '}
          <span className="font-semibold" style={{ color: colors.ink }}>{formattedTarget}</span>
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
      <h2 className="text-[17px] font-bold" style={{ color: colors.ink }}>Set a rate alert</h2>
      <p className="mb-5 mt-1 text-sm" style={{ color: `${colors.ink}66` }}>
        Get notified when the rate hits your target
      </p>

      <div className="mb-5 flex gap-2">
        <button
          type="button"
          onClick={() => handleTypeChange('ngn')}
          className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition"
          style={
            type === 'ngn'
              ? { backgroundColor: `${colors.teal}18`, color: colors.teal, boxShadow: `inset 0 0 0 1px ${colors.teal}55` }
              : { backgroundColor: `${colors.ink}08`, color: `${colors.ink}66` }
          }
        >
          🇳🇬 NGN rate
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('crypto')}
          className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition"
          style={
            type === 'crypto'
              ? { backgroundColor: `${colors.teal}18`, color: colors.teal, boxShadow: `inset 0 0 0 1px ${colors.teal}55` }
              : { backgroundColor: `${colors.ink}08`, color: `${colors.ink}66` }
          }
        >
          ₿ Crypto price
        </button>
      </div>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: `${colors.ink}44` }}>
        Asset &amp; direction
      </p>
      <div className="mb-4 flex gap-2">
        <select
          value={asset}
          onChange={(e) => setAsset(e.target.value)}
          className="flex-1 rounded-xl border px-3 py-2.5 text-sm outline-none"
          style={{ borderColor: `${colors.ink}14`, backgroundColor: `${colors.ink}06`, color: colors.ink }}
        >
          {(type === 'ngn' ? NGN_ASSETS : CRYPTO_ASSETS).map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
        <select
          value={direction}
          onChange={(e) => setDirection(e.target.value as Direction)}
          className="flex-1 rounded-xl border px-3 py-2.5 text-sm outline-none"
          style={{ borderColor: `${colors.ink}14`, backgroundColor: `${colors.ink}06`, color: colors.ink }}
        >
          <option value="above">Goes above</option>
          <option value="below">Falls below</option>
        </select>
      </div>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: `${colors.ink}44` }}>
        Target value
      </p>
      <input
        type="number"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder={type === 'ngn' ? 'e.g. 1500' : 'e.g. 80000'}
        className="mb-4 w-full rounded-xl border px-3 py-2.5 font-mono text-sm outline-none focus:ring-1"
        style={{ borderColor: `${colors.ink}14`, backgroundColor: `${colors.ink}06`, color: colors.ink }}
      />

      <div
        className="mb-5 flex items-center justify-between rounded-xl px-4 py-3"
        style={{ backgroundColor: `${colors.ink}06` }}
      >
        <span className="text-sm" style={{ color: `${colors.ink}66` }}>Current {asset} rate</span>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-xs font-semibold text-emerald-600">Live</span>
          <span className="font-mono text-sm font-bold" style={{ color: colors.ink }}>
            {currentRate}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!target}
        className="w-full rounded-xl py-3.5 text-sm font-bold text-white transition disabled:opacity-40 active:scale-[0.98]"
        style={{ backgroundColor: colors.ink }}
      >
        Create alert
      </button>
    </>
  )
}
