'use client'

import { Shield, Wallet, ArrowLeftRight, BadgeCheck } from 'lucide-react'
import { colors } from '@/lib/colors'
import { formatNgn } from '@/lib/format'
import type { UserProfile } from '@/types'

interface AccountStatsProps {
  user: UserProfile | null
  totalNgn: number
  transactionCount: number
  walletCount: number
}

function getKycLevelName(kycLevel: UserProfile['kyc_level']): string {
  if (typeof kycLevel === 'object' && kycLevel?.level_name) {
    return kycLevel.level_name
  }
  return 'Basic'
}

function getDailyLimit(kycLevel: UserProfile['kyc_level']): number | null {
  if (typeof kycLevel === 'object' && kycLevel?.daily_limit) {
    return kycLevel.daily_limit
  }
  return null
}

export function AccountStats({
  user,
  totalNgn,
  transactionCount,
  walletCount,
}: AccountStatsProps) {
  const dailyLimit = user ? getDailyLimit(user.kyc_level) : null

  const stats = [
    {
      icon: <Wallet className="size-4" />,
      label: 'Total holdings',
      value: formatNgn(totalNgn),
      color: colors.blue,
    },
    {
      icon: <ArrowLeftRight className="size-4" />,
      label: 'Transactions',
      value: String(transactionCount),
      color: colors.teal,
    },
    {
      icon: <Shield className="size-4" />,
      label: 'KYC level',
      value: user ? getKycLevelName(user.kyc_level) : '—',
      color: colors.gold,
    },
    {
      icon: <BadgeCheck className="size-4" />,
      label: 'Active wallets',
      value: String(walletCount),
      color: colors.ink,
    },
  ]

  return (
    <div>
      <h2 className="text-[17px] font-bold" style={{ color: colors.ink }}>
        Account overview
      </h2>
      <p className="mt-0.5 text-sm" style={{ color: `${colors.ink}55` }}>
        Your SwiftyEx account at a glance
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border p-4"
            style={{ borderColor: `${stat.color}18`, backgroundColor: `${stat.color}06` }}
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${stat.color}14`, color: stat.color }}
            >
              {stat.icon}
            </div>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-wide" style={{ color: `${colors.ink}55` }}>
              {stat.label}
            </p>
            <p className="mt-0.5 text-lg font-bold capitalize" style={{ color: colors.ink }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {dailyLimit != null && (
        <div
          className="mt-3 rounded-xl px-4 py-3 text-xs"
          style={{ backgroundColor: `${colors.blue}08`, color: `${colors.ink}88` }}
        >
          Daily limit: <span className="font-semibold">{formatNgn(dailyLimit)}</span>
          {typeof user?.kyc_level === 'object' && user.kyc_level.monthly_limit && (
            <>
              {' · '}
              Monthly: <span className="font-semibold">{formatNgn(user.kyc_level.monthly_limit)}</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
