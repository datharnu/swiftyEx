// 'use client'

// import { useMemo, useState } from 'react'
// import { ArrowDownUp, RefreshCcw } from 'lucide-react'
// import { WalletPicker } from './WalletPicker'
// import { getWalletSymbol } from '@/lib/assets'
// import { openBotAction } from '@/lib/bot'
// import { parseBalance } from '@/lib/format'
// import type { Rates, Wallet, WalletType } from '@/types'

// interface SwapSheetProps {
//   wallets: Wallet[]
//   rates: Rates
//   onClose: () => void
// }

// const RATE_KEY: Partial<Record<WalletType, keyof Rates>> = {
//   usdt: 'USDT',
//   usd: 'USD',
//   btc: 'BTC',
//   ethereum: 'ETH',
// }

// function getRate(walletType: WalletType, rates: Rates, side: 'buy' | 'sell'): number {
//   if (walletType === 'naira') return 1
//   const key = RATE_KEY[walletType]
//   if (!key) return 0
//   return parseBalance(rates[key][side])
// }

// export function SwapSheet({ wallets, rates, onClose }: SwapSheetProps) {
//   const [from, setFrom] = useState<WalletType>(wallets[0]?.wallet_type ?? 'naira')
//   const [to, setTo] = useState<WalletType>(
//     wallets.find((w) => w.wallet_type !== wallets[0]?.wallet_type)?.wallet_type ?? 'usdt',
//   )
//   const [amount, setAmount] = useState('')
//   const [step, setStep] = useState<'form' | 'processing' | 'success'>('form')

//   const fromWallet = wallets.find((w) => w.wallet_type === from)
//   const balance = parseBalance(fromWallet?.balance)
//   const amountNum = parseBalance(amount)

//   const sellRate = getRate(from === 'naira' ? 'usdt' : from, rates, 'sell')
//   const buyRate = getRate(to === 'naira' ? 'usdt' : to, rates, 'buy')

//   const estimatedReceive = useMemo(() => {
//     if (!amountNum || !sellRate || !buyRate) return 0

//     if (from === 'naira' && to !== 'naira') {
//       return amountNum / buyRate
//     }
//     if (from !== 'naira' && to === 'naira') {
//       return amountNum * sellRate
//     }
//     if (from !== 'naira' && to !== 'naira') {
//       return (amountNum * sellRate) / buyRate
//     }
//     return 0
//   }, [amountNum, from, to, sellRate, buyRate])

//   const isCryptoOut = to === 'usdt' || to === 'btc' || to === 'ethereum'
//   const isValid = amountNum > 0 && amountNum <= balance && from !== to

//   function swapDirection() {
//     setFrom(to)
//     setTo(from)
//     setAmount('')
//   }

//   async function handleSubmit() {
//     if (!isValid) return

//     setStep('processing')

//     await new Promise((r) => setTimeout(r, 1200))

//     setStep('success')

//     setTimeout(() => {
//       openBotAction('swap', {
//         from,
//         to,
//         amount: amount.replace(/,/g, ''),
//       })
//     }, 1000)
//   }

//   return (
//     <div>
//       <div className="mb-5 flex items-center gap-3">
//         <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
//           <RefreshCcw className="size-5" />
//         </div>
//         <div>
//           <h2 className="text-lg font-bold text-zinc-900">Swap</h2>
//           <p className="text-sm text-zinc-400">Exchange at live rates</p>
//         </div>
//       </div>

//       <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
//         You pay
//       </p>
//       <WalletPicker wallets={wallets} value={from} onChange={setFrom} exclude={[to]} />

//       <div className="relative my-3 flex justify-center">
//         <button
//           type="button"
//           onClick={swapDirection}
//           aria-label="Swap direction"
//           className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm transition active:scale-95 hover:bg-zinc-50"
//         >
//           <ArrowDownUp className="size-4 text-zinc-600" />
//         </button>
//       </div>

//       <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
//         You receive
//       </p>
//       <WalletPicker wallets={wallets} value={to} onChange={setTo} exclude={[from]} />

//       <div className="mt-5">
//         <label htmlFor="swap-amount" className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
//           Amount
//         </label>
//         <input
//           id="swap-amount"
//           type="text"
//           inputMode="decimal"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
//           placeholder="0.00"
//           className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-lg font-semibold text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white"
//         />
//       </div>

//       {amountNum > 0 && (
//         <div className="mt-4 rounded-xl bg-zinc-50 px-4 py-3">
//           <p className="text-xs text-zinc-400">Estimated receive</p>
//           <p className="mt-0.5 text-lg font-bold text-zinc-900">
//             {getWalletSymbol(to)}
//             {estimatedReceive.toLocaleString('en-US', {
//               minimumFractionDigits: 2,
//               maximumFractionDigits: isCryptoOut ? 8 : 2,
//             })}
//           </p>
//           <p className="mt-1 text-[11px] text-zinc-400">
//             Rate: ₦{sellRate.toLocaleString()} sell · ₦{buyRate.toLocaleString()} buy
//           </p>
//         </div>
//       )}

//       <button
//         type="button"
//         onClick={handleSubmit}
//         disabled={!isValid}
//         className="mt-6 w-full rounded-xl bg-zinc-900 py-3.5 text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-40"
//       >
//         Confirm swap
//       </button>

//       {step === 'processing' && (
//         <div className="flex flex-col items-center py-10 text-center">
//           <RefreshCcw className="size-6 animate-spin text-zinc-500" />
//           <p className="mt-3 text-sm text-zinc-600">
//             Processing your swap...
//           </p>
//           <p className="text-xs text-zinc-400">
//             Locking rate and executing trade
//           </p>
//         </div>
//       )}

//       {step === 'success' && (
//         <div className="flex flex-col items-center py-10 text-center">
//           <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600">
//             ✓
//           </div>

//           <p className="mt-3 text-sm font-semibold text-zinc-900">
//             Swap successful
//           </p>

//           <p className="text-xs text-zinc-500">
//             Your transaction has been recorded
//           </p>

//           <button
//             onClick={onClose}
//             className="mt-5 w-full rounded-xl bg-zinc-900 py-3 text-white text-sm"
//           >
//             Done
//           </button>
//         </div>
//       )}

//     </div>
//   )
// }




'use client'

import { useMemo, useState } from 'react'
import { ArrowDownUp, RefreshCcw, CheckCircle2 } from 'lucide-react'
import { WalletPicker } from './WalletPicker'
import { getWalletSymbol } from '@/lib/assets'
import { parseBalance } from '@/lib/format'
import type { Rates, Wallet, WalletType } from '@/types'

interface SwapSheetProps {
  wallets: Wallet[]
  rates: Rates
  onClose: () => void
}

const RATE_KEY: Partial<Record<WalletType, keyof Rates>> = {
  usdt: 'USDT',
  usd: 'USD',
  btc: 'BTC',
  ethereum: 'ETH',
}

function getRate(
  walletType: WalletType,
  rates: Rates,
  side: 'buy' | 'sell',
): number {
  if (walletType === 'naira') return 1
  const key = RATE_KEY[walletType]
  if (!key) return 0
  return parseBalance(rates[key][side])
}

export function SwapSheet({ wallets, rates, onClose }: SwapSheetProps) {
  const [from, setFrom] = useState<WalletType>(
    wallets[0]?.wallet_type ?? 'naira',
  )

  const [to, setTo] = useState<WalletType>(
    wallets.find((w) => w.wallet_type !== wallets[0]?.wallet_type)
      ?.wallet_type ?? 'usdt',
  )

  const [amount, setAmount] = useState('')
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form')

  const fromWallet = wallets.find((w) => w.wallet_type === from)
  const balance = parseBalance(fromWallet?.balance)
  const amountNum = parseBalance(amount)

  const sellRate = getRate(from === 'naira' ? 'usdt' : from, rates, 'sell')
  const buyRate = getRate(to === 'naira' ? 'usdt' : to, rates, 'buy')

  const estimatedReceive = useMemo(() => {
    if (!amountNum || !sellRate || !buyRate) return 0

    if (from === 'naira' && to !== 'naira') {
      return amountNum / buyRate
    }
    if (from !== 'naira' && to === 'naira') {
      return amountNum * sellRate
    }
    if (from !== 'naira' && to !== 'naira') {
      return (amountNum * sellRate) / buyRate
    }
    return 0
  }, [amountNum, from, to, sellRate, buyRate])

  const isCryptoOut =
    to === 'usdt' || to === 'btc' || to === 'ethereum'

  const isValid =
    amountNum > 0 && amountNum <= balance && from !== to

  function swapDirection() {
    setFrom(to)
    setTo(from)
    setAmount('')
  }

  async function handleSubmit() {
    if (!isValid) return

    setStep('processing')

    // simulate processing delay (UX polish)
    await new Promise((r) => setTimeout(r, 1200))

    setStep('success')
  }

  return (
    <div>
      {/* HEADER */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <RefreshCcw className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-zinc-900">Swap</h2>
          <p className="text-sm text-zinc-400">Exchange at live rates</p>
        </div>
      </div>

      {/* FORM */}
      {step === 'form' && (
        <>
          <p className="mb-2 text-xs font-semibold uppercase text-zinc-400">
            You pay
          </p>

          <WalletPicker
            wallets={wallets}
            value={from}
            onChange={setFrom}
            exclude={[to]}
          />

          <div className="relative my-3 flex justify-center">
            <button
              type="button"
              onClick={swapDirection}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm transition active:scale-95 hover:bg-zinc-50"
            >
              <ArrowDownUp className="size-4 text-zinc-600" />
            </button>
          </div>

          <p className="mb-2 text-xs font-semibold uppercase text-zinc-400">
            You receive
          </p>

          <WalletPicker
            wallets={wallets}
            value={to}
            onChange={setTo}
            exclude={[from]}
          />

          <div className="mt-5">
            <label className="text-xs font-semibold uppercase text-zinc-400">
              Amount
            </label>

            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value.replace(/[^0-9.]/g, ''))
              }
              placeholder="0.00"
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-lg font-semibold text-zinc-900 outline-none focus:border-zinc-400 focus:bg-white"
            />
          </div>

          {amountNum > 0 && (
            <div className="mt-4 rounded-xl bg-zinc-50 px-4 py-3">
              <p className="text-xs text-zinc-400">Estimated receive</p>

              <p className="mt-0.5 text-lg font-bold text-zinc-900">
                {getWalletSymbol(to)}
                {estimatedReceive.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: isCryptoOut ? 8 : 2,
                })}
              </p>

              <p className="mt-1 text-[11px] text-zinc-400">
                Rate: ₦{sellRate.toLocaleString()} sell · ₦
                {buyRate.toLocaleString()} buy
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className="mt-6 w-full rounded-xl bg-zinc-900 py-3.5 text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-40"
          >
            Confirm swap
          </button>
        </>
      )}

      {/* PROCESSING */}
      {step === 'processing' && (
        <div className="flex flex-col items-center py-10 text-center">
          <RefreshCcw className="size-6 animate-spin text-zinc-500" />
          <p className="mt-3 text-sm text-zinc-600">
            Processing your swap...
          </p>
          <p className="text-xs text-zinc-400">
            Locking rate and executing trade
          </p>
        </div>
      )}

      {/* SUCCESS */}
      {step === 'success' && (
        <div className="flex flex-col items-center py-10 text-center">
          <CheckCircle2 className="size-7 text-green-500" />

          <p className="mt-3 text-sm font-semibold text-zinc-900">
            Swap successful
          </p>

          <p className="text-xs text-zinc-500">
            Your transaction has been recorded
          </p>

          <button
            onClick={onClose}
            className="mt-5 w-full rounded-xl bg-zinc-900 py-3 text-sm text-white"
          >
            Done
          </button>
        </div>
      )}
    </div>
  )
}