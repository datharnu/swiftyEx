'use client'

import { useState } from 'react'
import balanceBg from '../../public/Balance.png'
import { RatesBanner } from './RatesBanner'
import type { Rates } from '@/types'

// ── Types ──────────────────────────────────────────────────────────────────

type CardId = 'usd' | 'btc' | 'naira'

interface WalletCard {
  id: CardId
  label: string
  displayName: string
  currencySymbol: string
  balance: string
}

interface WalletStackProps {
  wallets?: import('@/types').Wallet[]
  rates?: Rates
  totalNGN?: string
  accountName?: string
  onSetAlert?: () => void
}

// ── Card Definitions ───────────────────────────────────────────────────────

const CARD_DEFS: WalletCard[] = [
  {
    id: 'usd',
    label: 'USD',
    displayName: 'USD Wallet',
    currencySymbol: '$',
    balance: '12,420.78',
  },
  {
    id: 'btc',
    label: 'BTC',
    displayName: 'BTC Wallet',
    currencySymbol: '₿',
    balance: '0.00230000',
  },
  {
    id: 'naira',
    label: 'Naira',
    displayName: 'Naira Wallet',
    currencySymbol: '₦',
    balance: '284,500.00',
  },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

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

  const cleaned = balance.replace(/,/g, '')
  const [intPart = '0', decPart = ''] = cleaned.split('.')
  const whole = Number(intPart).toLocaleString('en-US')

  if (isCrypto) {
    return (
      <span className="font-mono text-3xl font-bold text-white">
        {symbol}{whole}.{decPart || '00'}
      </span>
    )
  }

  const cents = (decPart + '00').slice(0, 2)

  return (
    <span className="font-mono font-bold text-white">
      <span className="text-3xl">{symbol}{whole}</span>
      <span className="ml-0.5 text-lg align-top opacity-90">.{cents}</span>
    </span>
  )
}

// ── Mini card styling ──────────────────────────────────────────────────────

const MINI_CARD_STYLE: Record<
  CardId,
  { bg: string; text: string; chip: string; icon: string; pattern?: boolean }
> = {
  usd: { bg: '#111111', text: '#ffffff', chip: '#ffffff', icon: '#ffffff' },
  btc: { bg: '#4A9FE8', text: '#ffffff', chip: '#ffffff', icon: '#ffffff' },
  naira: { bg: '#E4E4E4', text: '#333333', chip: '#E85C6A', icon: '#333333', pattern: true },
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
  onToggleHide,
}: {
  walletName: string
  symbol: string
  balance: string
  hidden: boolean
  isCrypto: boolean
  onToggleHide: () => void
}) {
  return (
    <div
      className="relative mb-2 w-full overflow-hidden rounded-xl"
      style={{
        // aspectRatio: `${balanceBg.width} / ${balanceBg.height}`,
        backgroundImage: `url(${balanceBg.src})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative flex h-[138px] flex-col justify-center p-6">
        <div className="">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] font-bold text-white">
              Total Balance
            </p>
            <div className="mt-2 flex items-center gap-3">
              <BalanceDisplay
                symbol={symbol}
                balance={balance}
                hidden={hidden}
                isCrypto={isCrypto}
              />
              <EyeToggleButton hidden={hidden} onToggle={onToggleHide} />
            </div>
      
      <p className="mt-3 text-right  text-sm font-semibold tracking-wide text-white">
              {walletName}
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}

function MiniDebitCard({
  card,
  selected,
  onClick,
}: {
  card: WalletCard
  selected: boolean
  onClick: () => void
}) {
  const style = MINI_CARD_STYLE[card.id]

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={`${card.label} wallet`}
      className={`relative h-[26px] w-[44px] shrink-0 overflow-hidden rounded-[5px] transition-all active:scale-[0.97] ${
        selected ? 'ring-2 ring-white/50 ring-offset-2 ring-offset-transparent scale-[1.04]' : 'opacity-90 hover:opacity-100'
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

      <div className="relative flex h-full flex-col justify-between p-1 gap-1">
        <div className="flex items-center justify-between">
          <ChipIcon color={style.chip} />
          <ContactlessIcon color={style.icon} />
        </div>
        <span className="text-left text-[9px] font-semibold tracking-wide" style={{ color: style.text }}>
          {card.label}
        </span>
      </div>
    </button>
  )
}

function AddWalletButton() {
  return (
    <button
      type="button"
      aria-label="Add wallet"
      className="flex h-[26px] w-[44px] shrink-0 items-center justify-center rounded-[5px] bg-[#111111] transition-all hover:bg-[#222222] active:scale-[0.97]"
    >
      <svg width="14" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
      </svg>
    </button>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function WalletStack({
  wallets,
  rates,
  totalNGN = '284,500.00',
  accountName: _accountName = 'SwiftyEx User',
  onSetAlert,
}: WalletStackProps) {
  const [selectedCardId, setSelectedCardId] = useState<CardId>('usd')
  const [hideBalance, setHideBalance] = useState(true)
 
  void _accountName

  const cardsWithRealData = CARD_DEFS.map((def) => {
    const walletKey = def.id === 'usd' ? 'usdt' : def.id
    const real = wallets?.find((w) => w.wallet_type === walletKey || w.wallet_type === def.id)
    const balance =
      def.id === 'naira'
        ? real?.balance && real.balance !== '0.00'
          ? real.balance
          : totalNGN
        : (real?.balance ?? def.balance)
    return { ...def, balance }
  })

  const selected = cardsWithRealData.find((c) => c.id === selectedCardId)!



  return (
    <div className="w-full max-w-md mx-auto pt-5 select-none">
      <BalanceHero
        walletName={selected.displayName}
        symbol={selected.currencySymbol}
        balance={selected.balance}
        hidden={hideBalance}
        isCrypto={selectedCardId === 'btc'}
        onToggleHide={() => setHideBalance((v) => !v)}
      />
     <RatesBanner
          rates={rates}
          onSetAlert={onSetAlert}  // ← wire it
        />
     
      <div className="flex items-center gap-3 mx-2 overflow-x-auto py-4 scrollbar-hide">
        {cardsWithRealData.map((card) => (
          <MiniDebitCard
            key={card.id}
            card={card}
            selected={selectedCardId === card.id}
            onClick={() => setSelectedCardId(card.id)}
          />
        ))}
        <AddWalletButton />
      </div>
    </div>
  )
}
