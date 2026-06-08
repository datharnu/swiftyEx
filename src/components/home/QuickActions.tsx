'use client'

import { useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, Landmark, RefreshCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import { DepositSheet } from '@/components/actions/DepositSheet'
import { WithdrawSheet } from '@/components/actions/WithdrawSheet'
import { SwapSheet } from '@/components/actions/SwapSheet'
import { OtcSheet } from '@/components/actions/OtcSheet'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { useTelegram } from '@/hooks/useTelegram'
import type { Rates, Wallet } from '@/types'

export type QuickActionId = 'deposit' | 'withdraw' | 'swap' | 'otc'

const ACTIONS: {
  id: QuickActionId
  icon: typeof ArrowDownLeft
  label: string
  color: string
  bg: string
}[] = [
  {
    id: 'deposit',
    icon: ArrowDownLeft,
    label: 'Deposit',
    color: '#377CC8',
    bg: 'rgba(55, 124, 200, 0.1)',
  },
  {
    id: 'withdraw',
    icon: ArrowUpRight,
    label: 'Withdraw',
    color: '#242424',
    bg: 'rgba(36, 36, 36, 0.08)',
  },
  {
    id: 'swap',
    icon: RefreshCcw,
    label: 'Swap',
    color: '#C9A227',
    bg: 'rgba(238, 216, 104, 0.2)',
  },
  {
    id: 'otc',
    icon: Landmark,
    label: 'OTC Desk',
    color: '#469B88',
    bg: 'rgba(70, 155, 136, 0.12)',
  },
]

interface QuickActionsProps {
  wallets: Wallet[]
  rates: Rates
}

export function QuickActions({ wallets, rates }: QuickActionsProps) {
  const { tg } = useTelegram()
  const [activeSheet, setActiveSheet] = useState<QuickActionId | null>(null)
  const [sheetKey, setSheetKey] = useState(0)

  function openSheet(id: QuickActionId) {
    tg?.HapticFeedback?.impactOccurred('light')
    setSheetKey((k) => k + 1)
    setActiveSheet(id)
  }

  function closeSheet() {
    setActiveSheet(null)
  }

  return (
    <>
      <section className="px-6 pb-2 pt-4">
        <h2 className="mb-3 text-sm font-semibold text-zinc-900">Quick actions</h2>
        <div className="flex justify-between gap-2">
          {ACTIONS.map((action, i) => (
            <motion.button
              key={action.id}
              type="button"
              onClick={() => openSheet(action.id)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.06)] backdrop-blur-xl transition active:scale-95"
                style={{ backgroundColor: action.bg }}
              >
                <action.icon strokeWidth={2} className="size-5" style={{ color: action.color }} />
              </div>
              <span className="text-[11px] font-medium text-zinc-600">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </section>

      <BottomSheet open={activeSheet !== null} onClose={closeSheet}>
        {activeSheet === 'deposit' && (
          <DepositSheet key={`deposit-${sheetKey}`} wallets={wallets} onClose={closeSheet} />
        )}
        {activeSheet === 'withdraw' && (
          <WithdrawSheet key={`withdraw-${sheetKey}`} wallets={wallets} onClose={closeSheet} />
        )}
        {activeSheet === 'swap' && (
          <SwapSheet
            key={`swap-${sheetKey}`}
            wallets={wallets}
            rates={rates}
            onClose={closeSheet}
          />
        )}
        {activeSheet === 'otc' && (
          <OtcSheet key={`otc-${sheetKey}`} onClose={closeSheet} />
        )}
      </BottomSheet>
    </>
  )
}
