'use client'

import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import type { Rates } from '@/types'

type AlertType = 'ngn' | 'crypto'
type Direction = 'above' | 'below'

interface AlertSheetProps {
  open: boolean
  onClose: () => void
  rates?: Rates
}

const NGN_ASSETS = ['USD / NGN'] as const
const CRYPTO_ASSETS = ['BTC / USDT', 'ETH / USDT'] as const

export function AlertSheet({ open, onClose, rates }: AlertSheetProps) {
  const addAlert = useAppStore((s) => s.addAlert)
  const [type, setType] = useState<AlertType>('ngn')
  const [asset, setAsset] = useState('USD / NGN')
  const [direction, setDirection] = useState<Direction>('above')
  const [target, setTarget] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const currentRate = type === 'ngn'
    ? `₦${Number(rates?.USDT?.buy ?? '1430').toLocaleString('en-NG')}`
    : asset.startsWith('BTC')
      ? `$${Number(rates?.BTC?.buy ?? '76560').toLocaleString('en-US')}`
      : `$${Number(rates?.ETH?.buy ?? '2110').toLocaleString('en-US')}`

  function handleTypeChange(t: AlertType) {
    setType(t)
    setAsset(t === 'ngn' ? 'USD / NGN' : 'BTC / USDT')
  }

  function handleSubmit() {
    const targetNum = Number(target)
    if (!target || Number.isNaN(targetNum)) return

    const currentValue = type === 'ngn'
      ? Number(rates?.USDT?.buy ?? '1430')
      : asset.startsWith('BTC')
        ? Number(rates?.BTC?.buy ?? '76560')
        : Number(rates?.ETH?.buy ?? '2110')

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

  function handleClose() {
    onClose()
    // reset after sheet closes
    setTimeout(() => {
      setSubmitted(false)
      setTarget('')
      setType('ngn')
      setAsset('USD / NGN')
      setDirection('above')
    }, 400)
  }

  const formattedTarget = target
  ? type === 'ngn'
    ? `₦${Number(target).toLocaleString('en-NG')}`
    : `$${Number(target).toLocaleString('en-US')}`
  : ''

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white px-5 pb-10 pt-3 shadow-2xl transition-transform duration-[350ms] ease-[cubic-bezier(0.34,1.1,0.64,1)] ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Handle */}
        <div className="mx-auto mb-5 h-1 w-9 rounded-full bg-zinc-200" />

        {!submitted ? (
          <>
            <h2 className="text-[17px] font-bold text-zinc-900">Set a rate alert</h2>
            <p className="mb-5 mt-1 text-sm text-zinc-500">
              Get notified when the rate hits your target
            </p>

            {/* Type toggle */}
            <div className="mb-5 flex gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange('ngn')}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${
                  type === 'ngn'
                    ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300'
                    : 'bg-zinc-100 text-zinc-500'
                }`}
              >
                🇳🇬 NGN rate
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('crypto')}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${
                  type === 'crypto'
                    ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300'
                    : 'bg-zinc-100 text-zinc-500'
                }`}
              >
                ₿ Crypto price
              </button>
            </div>

            {/* Asset + direction */}
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Asset & direction
            </p>
            <div className="mb-4 flex gap-2">
              <select
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
                className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-800 outline-none"
              >
                {(type === 'ngn' ? NGN_ASSETS : CRYPTO_ASSETS).map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as Direction)}
                className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-800 outline-none"
              >
                <option value="above">Goes above</option>
                <option value="below">Falls below</option>
              </select>
            </div>

            {/* Target value */}
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Target value
            </p>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder={type === 'ngn' ? 'e.g. 1500' : 'e.g. 80000'}
              className="mb-4 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 font-mono text-sm text-zinc-800 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100"
            />

            {/* Current rate pill */}
            <div className="mb-5 flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-3">
              <span className="text-sm text-zinc-500">Current {asset} rate</span>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-emerald-600">Live</span>
                <span className="font-mono text-sm font-bold text-zinc-800">
                  {currentRate}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!target}
              className="w-full rounded-xl bg-zinc-900 py-3.5 text-sm font-bold text-white transition disabled:opacity-40 active:scale-[0.98]"
            >
              Create alert
            </button>
          </>
        ) : (
          /* Success state */
          <div className="flex flex-col items-center py-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"
                strokeLinejoin="round" aria-hidden>
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-zinc-900">Alert set!</h3>
            <p className="mt-2 text-sm text-zinc-500">
              You&apos;ll be notified when{' '}
              <span className="font-semibold text-zinc-700">{asset}</span>{' '}
              {direction === 'above' ? 'goes above' : 'falls below'}{' '}
              <span className="font-semibold text-zinc-700">{formattedTarget}</span>
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-6 w-full rounded-xl border border-zinc-200 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 active:scale-[0.98]"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </>
  )
}