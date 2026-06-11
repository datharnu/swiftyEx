'use client'

import { useState } from 'react'
import { Landmark, Shield, CheckCircle2 } from 'lucide-react'
import { formatNgn, parseBalance } from '@/lib/format'

const OTC_PERKS = [
  'Personalised rates for large orders',
  'Dedicated settlement support',
  'Faster execution on bulk trades',
]

interface OtcSheetProps {
  onClose: () => void
}

export function OtcSheet({ onClose }: OtcSheetProps) {
  const [amount, setAmount] = useState('')
  const [step, setStep] = useState<'form' | 'success'>('form')
  const amountNum = parseBalance(amount)
  const isValid = amountNum >= 100_000

  function handleContact() {
    if (!isValid) return
    setStep('success')
  }

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
          <Landmark className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-zinc-900">OTC Desk</h2>
          <p className="text-sm text-zinc-400">Large orders, better rates</p>
        </div>
      </div>

      {step === 'form' && (
        <>
          <div className="rounded-2xl bg-gradient-to-br from-teal-50 to-blue-50 p-4">
            <div className="flex items-center gap-2 text-teal-800">
              <Shield className="size-4" />
              <p className="text-sm font-semibold">Institutional-grade trading</p>
            </div>
            <ul className="mt-3 space-y-2">
              {OTC_PERKS.map((perk) => (
                <li key={perk} className="flex items-start gap-2 text-sm text-zinc-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5">
            <label htmlFor="otc-amount" className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Order size (NGN)
            </label>
            <input
              id="otc-amount"
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="1,000,000"
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-lg font-semibold text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white"
            />
            {amountNum > 0 && amountNum < 100_000 && (
              <p className="mt-1 text-xs text-amber-600">Minimum OTC order is {formatNgn(100_000)}</p>
            )}
            {amountNum >= 100_000 && (
              <p className="mt-1 text-xs text-emerald-600">
                Eligible for OTC · {formatNgn(amountNum)}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleContact}
            disabled={!isValid}
            className="mt-6 w-full rounded-xl bg-teal-700 py-3.5 text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-40"
          >
            Contact OTC desk
          </button>

          <p className="mt-3 text-center text-[11px] text-zinc-400">
            Submit your order size to contact the desk
          </p>
        </>
      )}

      {step === 'success' && (
        <div className="flex flex-col items-center py-10 text-center">
          <CheckCircle2 className="size-7 text-teal-600" />
          <h3 className="mt-3 text-sm font-semibold text-zinc-900">
            OTC Request Submitted
          </h3>
          <p className="mt-1 text-xs text-zinc-500 max-w-[240px]">
            Your request for an OTC order of {formatNgn(amountNum)} has been recorded. An institutional manager will review and contact you shortly.
          </p>

          <button
            onClick={onClose}
            className="mt-6 w-full rounded-xl bg-teal-700 py-3 text-sm text-white font-semibold transition active:scale-95"
          >
            Done
          </button>
        </div>
      )}
    </div>
  )
}
