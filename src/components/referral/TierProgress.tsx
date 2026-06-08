'use client'

import { Crown, Sparkles, Zap } from 'lucide-react'
import { colors } from '@/lib/colors'
import { getTierProgress, REFERRAL_TIERS, type ReferralTierId } from '@/lib/referral'

interface TierProgressProps {
  referralCount: number
}

const TIER_ICONS: Record<ReferralTierId, typeof Sparkles> = {
  swiftling: Sparkles,
  swiftrunner: Zap,
  swiftlord: Crown,
  elite: Crown,
}

export function TierProgress({ referralCount }: TierProgressProps) {
  const { currentTier, nextTier, progress, remaining } = getTierProgress(referralCount)
  const TierIcon = TIER_ICONS[currentTier.id]

  return (
    <section
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: `linear-gradient(145deg, ${colors.ink} 0%, #1a1a1a 50%, ${colors.ink} 100%)`,
        boxShadow: `0 8px 32px ${colors.ink}44, inset 0 1px 0 rgba(255,255,255,0.06)`,
      }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(ellipse at 80% 0%, ${currentTier.glow} 0%, transparent 55%)`,
        }}
      />

      <div className="relative p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: `${colors.gold}99` }}>
              Current tier
            </p>
            <div className="mt-1 flex items-center gap-2">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: `${currentTier.color}22`,
                  boxShadow: `0 0 20px ${currentTier.glow}`,
                }}
              >
                <TierIcon className="size-4" style={{ color: currentTier.color }} />
              </div>
              <h3 className="text-xl font-bold text-white">{currentTier.name}</h3>
            </div>
          </div>
          <div
            className="rounded-full px-3 py-1 text-xs font-bold"
            style={{
              backgroundColor: `${colors.gold}18`,
              color: colors.gold,
              border: `1px solid ${colors.gold}33`,
            }}
          >
            {referralCount} invited
          </div>
        </div>

        {/* Tier steps */}
        <div className="mt-5 flex items-center justify-between gap-1">
          {REFERRAL_TIERS.map((tier, i) => {
            const reached = referralCount >= tier.minReferrals
            const isCurrent = tier.id === currentTier.id
            return (
              <div key={tier.id} className="flex flex-1 flex-col items-center gap-1.5">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-bold transition"
                  style={{
                    backgroundColor: reached ? `${tier.color}28` : `${colors.white}08`,
                    color: reached ? tier.color : `${colors.white}44`,
                    border: isCurrent ? `2px solid ${tier.color}` : '2px solid transparent',
                    boxShadow: isCurrent ? `0 0 12px ${tier.glow}` : 'none',
                  }}
                >
                  {i + 1}
                </div>
                <span
                  className="text-center text-[9px] font-medium leading-tight"
                  style={{ color: reached ? `${colors.white}CC` : `${colors.white}44` }}
                >
                  {tier.name}
                </span>
              </div>
            )
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <div
            className="h-2 overflow-hidden rounded-full"
            style={{ backgroundColor: `${colors.white}10` }}
          >
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progress}%`,
                background: nextTier
                  ? `linear-gradient(90deg, ${currentTier.color}, ${nextTier.color})`
                  : `linear-gradient(90deg, ${colors.gold}, ${colors.teal})`,
                boxShadow: `0 0 12px ${currentTier.glow}`,
              }}
            />
          </div>

          {nextTier ? (
            <p className="mt-2.5 text-sm" style={{ color: `${colors.white}88` }}>
              <span className="font-bold" style={{ color: colors.gold }}>
                {remaining} more
              </span>{' '}
              referral{remaining === 1 ? '' : 's'} to reach{' '}
              <span className="font-semibold text-white">{nextTier.name}</span>
            </p>
          ) : (
            <p className="mt-2.5 text-sm font-semibold" style={{ color: colors.gold }}>
              You&apos;ve reached the highest tier — Elite status unlocked
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
