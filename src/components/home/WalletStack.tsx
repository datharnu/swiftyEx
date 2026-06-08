'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import balanceBg from '../../public/Balance.png'
import { RatesBanner } from './RatesBanner'
import { DepositAddress } from '@/components/wallet/DepositAddress'
import { AssetIcon } from '@/components/ui/AssetIcon'
import { openBotAction } from '@/lib/bot'
import { walletTypeToAssetId } from '@/lib/assets'
import { formatBalance, parseBalance } from '@/lib/format'
import type { Rates, Wallet, WalletType } from '@/types'

interface WalletCardDef {
  id: WalletType
  label: string
  displayName: string
  currencySymbol: string
  isCrypto: boolean
  matchTypes: WalletType[]
}

const CARD_DEFS: WalletCardDef[] = [
  {
    id: 'naira',
    label: 'Naira',
    displayName: 'Naira Wallet',
    currencySymbol: '₦',
    isCrypto: false,
    matchTypes: ['naira'],
  },
  {
    id: 'usdt',
    label: 'USDT',
    displayName: 'USDT Wallet',
    currencySymbol: '',
    isCrypto: true,
    matchTypes: ['usdt'],
  },
  {
    id: 'usd',
    label: 'USD',
    displayName: 'USD Wallet',
    currencySymbol: '$',
    isCrypto: false,
    matchTypes: ['usd'],
  },
  {
    id: 'btc',
    label: 'BTC',
    displayName: 'BTC Wallet',
    currencySymbol: '₿',
    isCrypto: true,
    matchTypes: ['btc'],
  },
]

const MINI_CARD_STYLE: Record<string, { bg: string; text: string; chip: string; icon: string; pattern?: boolean }> = {
  naira: { bg: '#E4E4E4', text: '#333333', chip: '#E85C6A', icon: '#333333', pattern: true },
  usdt: { bg: '#111111', text: '#ffffff', chip: '#ffffff', icon: '#ffffff' },
  usd: { bg: '#1a3a5c', text: '#ffffff', chip: '#ffffff', icon: '#ffffff' },
  btc: { bg: '#4A9FE8', text: '#ffffff', chip: '#ffffff', icon: '#ffffff' },
}

interface WalletStackProps {
  wallets?: Wallet[]
  rates?: Rates
  kycVerified?: boolean
  onSetAlert?: () => void
}

function BalanceDisplay({
  symbol,
  balance,
  hidden,
  isCrypto = false,
}: {
  symbol: string
  balance: string
  hidden: boolean
  isCrypto?: boolean
}) {
  if (hidden) {
    return (
      <span className="font-mono text-3xl font-bold tracking-[6px] text-white">
        ••••••
      </span>
    )
  }

  const num = parseBalance(balance)
  const formatted = formatBalance(num, { isCrypto })

  if (isCrypto) {
    return (
      <span className="font-mono text-3xl font-bold text-white">
        {symbol}{formatted}
      </span>
    )
  }

  const [whole, cents = '00'] = formatted.split('.')
  return (
    <span className="font-mono font-bold text-white">
      <span className="text-3xl">{symbol}{whole}</span>
      <span className="ml-0.5 text-lg align-top opacity-90">.{cents}</span>
    </span>
  )
}

function ChipIcon({ color }: { color: string }) {
  return (
    <svg width="9" height="6" viewBox="0 0 14 11" fill="none" aria-hidden>
      <rect x="0.5" y="0.5" width="13" height="10" rx="1.5" stroke={color} strokeWidth="1" fill={`${color}22`} />
      <line x1="0.5" y1="3.5" x2="13.5" y2="3.5" stroke={color} strokeWidth="0.75" />
      <line x1="0.5" y1="7.5" x2="13.5" y2="7.5" stroke={color} strokeWidth="0.75" />
      <line x1="4.5" y1="0.5" x2="4.5" y2="10.5" stroke={color} strokeWidth="0.75" />
      <line x1="9.5" y1="0.5" x2="9.5" y2="10.5" stroke={color} strokeWidth="0.75" />
    </svg>
  )
}

function ContactlessIcon({ color }: { color: string }) {
  return (
    <svg width="9" height="6" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M6.5 3.5c1.8 1.8 1.8 3.2 0 5" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <path d="M4.5 2c3 3 3 5 0 8" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <path d="M2.5 0.5c4.2 4.2 4.2 7.8 0 11" stroke={color} strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

function EyeToggleButton({ hidden, onToggle }: { hidden: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
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

function BalanceHero({
  walletName,
  symbol,
  balance,
  hidden,
  isCrypto,
  isEmpty,
  kycVerified,
  onToggleHide,
}: {
  walletName: string
  symbol: string
  balance: string
  hidden: boolean
  isCrypto: boolean
  isEmpty: boolean
  kycVerified?: boolean
  onToggleHide: () => void
}) {
  return (
    <div
      className="relative mb-2 w-full overflow-hidden rounded-xl"
      style={{
        backgroundImage: `url(${balanceBg.src})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative flex h-[138px] flex-col justify-center p-6">
        <div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-white">
              {isEmpty ? 'Empty wallet' : 'Available balance'}
            </p>
            {!kycVerified && (
              <button
                type="button"
                onClick={() => openBotAction('kyc')}
                className="shrink-0 rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[10px] font-semibold text-amber-100 ring-1 ring-amber-300/40 transition active:scale-95"
              >
                KYC pending
              </button>
            )}
          </div>
          <div className="mt-2 flex items-center gap-3">
            <BalanceDisplay
              symbol={symbol}
              balance={balance}
              hidden={hidden}
              isCrypto={isCrypto}
            />
            <EyeToggleButton hidden={hidden} onToggle={onToggleHide} />
          </div>
          <p className="mt-3 text-right text-sm font-semibold tracking-wide text-white">
            {walletName}
          </p>
        </div>
      </div>
    </div>
  )
}

function MiniDebitCard({
  label,
  cardId,
  selected,
  onClick,
}: {
  label: string
  cardId: string
  selected: boolean
  onClick: () => void
}) {
  const style = MINI_CARD_STYLE[cardId] ?? MINI_CARD_STYLE.usdt

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={`${label} wallet`}
      className={`relative h-[26px] w-[44px] shrink-0 overflow-hidden rounded-[5px] transition-all active:scale-[0.97] ${
        selected ? 'scale-[1.04] ring-2 ring-white/50 ring-offset-2 ring-offset-transparent' : 'opacity-90 hover:opacity-100'
      }`}
      style={{ background: style.bg }}
    >
      {style.pattern && (
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='84' height='52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L84 52 L20 52 Z' fill='%23ffffff'/%3E%3C/svg%3E")`,
            backgroundSize: 'cover',
          }}
        />
      )}
      <div className="relative flex h-full flex-col justify-between gap-1 p-1">
        <div className="flex items-center justify-between">
          <ChipIcon color={style.chip} />
          <ContactlessIcon color={style.icon} />
        </div>
        <div className="flex items-center justify-start">
          <AssetIcon asset={walletTypeToAssetId(cardId)} size={10} />
        </div>
      </div>
    </button>
  )
}

export default function WalletStack({
  wallets = [],
  rates,
  kycVerified = true,
  onSetAlert,
}: WalletStackProps) {
  const activeCards = useMemo(() => {
    return CARD_DEFS.filter((def) =>
      wallets.some((w) => def.matchTypes.includes(w.wallet_type)),
    )
  }, [wallets])

  const cards = activeCards.length > 0 ? activeCards : CARD_DEFS.slice(0, 3)

  const [selectedId, setSelectedId] = useState<WalletType>(cards[0]?.id ?? 'naira')
  const [hideBalance, setHideBalance] = useState(true)

  const selectedDef = cards.find((c) => c.id === selectedId) ?? cards[0]
  const selectedWallet = wallets.find((w) =>
    selectedDef?.matchTypes.includes(w.wallet_type),
  ) ?? null

  const balance = selectedWallet?.balance ?? '0'
  const isEmpty = parseBalance(balance) === 0

  return (
    <div className="mx-auto w-full max-w-md select-none pt-3">
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedId}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
        >
          <BalanceHero
            walletName={selectedDef.displayName}
            symbol={selectedDef.currencySymbol}
            balance={balance}
            hidden={hideBalance}
            isCrypto={selectedDef.isCrypto}
            isEmpty={isEmpty}
            kycVerified={kycVerified}
            onToggleHide={() => setHideBalance((v) => !v)}
          />
        </motion.div>
      </AnimatePresence>

      <RatesBanner rates={rates} onSetAlert={onSetAlert} lastUpdated={new Date()} />

      <div className="mx-2 flex items-center gap-3 overflow-x-auto py-4 scrollbar-hide">
        {cards.map((card) => (
          <MiniDebitCard
            key={card.id}
            cardId={card.id}
            label={card.label}
            selected={selectedId === card.id}
            onClick={() => setSelectedId(card.id)}
          />
        ))}
      </div>

      <div className="mx-2 mb-2">
        <DepositAddress wallet={selectedWallet} walletLabel={selectedDef.label} />
      </div>
    </div>
  )
}
