'use client'

import { Gift, TrendingUp, Users } from 'lucide-react'
import { BottomNav } from '@/components/layout/BottomNav'
import { StatusBar } from '@/components/layout/StatusBar'
import { LeaderBoard } from '@/components/referral/LeaderBoard'
import { ReferralLink } from '@/components/referral/ReferralLink'
import { TierProgress } from '@/components/referral/TierProgress'
import { Loader } from '@/components/ui/Loader'
import { colors } from '@/lib/colors'
import { mockReferral, mockUser } from '@/lib/mock'
import { formatEarnings } from '@/lib/referral'
import { useAppStore } from '@/store/useAppStore'

export default function ReferralPage() {
  const user = useAppStore((s) => s.user)
  const isLoading = useAppStore((s) => s.isLoading)
  const referral = mockReferral
  const profile = user ?? mockUser

  return (
    <main className="min-h-screen pb-28" style={{ backgroundColor: colors.white }}>
      <StatusBar />

      <div className="px-6 pt-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden>
            🏆
          </span>
          <div>
            <h1 className="text-[17px] font-bold" style={{ color: colors.ink }}>
              Earn
            </h1>
            <p className="text-sm" style={{ color: `${colors.ink}55` }}>
              Invite friends, climb tiers, win rewards
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 px-6">
        <div
          className="relative overflow-hidden rounded-2xl p-5"
          style={{
            background: `linear-gradient(135deg, ${colors.blue} 0%, #2a5f9e 45%, ${colors.teal} 100%)`,
            boxShadow: `0 12px 40px ${colors.blue}33`,
          }}
        >
          <div
            className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-30"
            style={{ backgroundColor: colors.gold }}
          />
          <div
            className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full opacity-20"
            style={{ backgroundColor: colors.white }}
          />

          <p className="relative text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
            Your referral earnings
          </p>

          {isLoading ? (
            <div className="relative mt-3 flex h-10 items-center">
              <Loader className="border-white/30 border-t-white" />
            </div>
          ) : (
            <p className="relative mt-1 text-3xl font-bold text-white">
              {formatEarnings(referral.total_earned)}
            </p>
          )}

          <div className="relative mt-5 grid grid-cols-2 gap-3">
            <StatPill
              icon={<Users className="size-4" />}
              label="Invited"
              value={String(referral.total_invited)}
            />
            <StatPill
              icon={<TrendingUp className="size-4" />}
              label="Your rank"
              value={`#${referral.rank}`}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-5 px-6">
        <TierProgress referralCount={referral.total_invited} />

        {isLoading ? (
          <div
            className="flex h-40 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${colors.ink}06` }}
          >
            <div
              className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"
              style={{ borderColor: `${colors.ink}22`, borderTopColor: colors.ink }}
              role="status"
              aria-label="Loading"
            />
          </div>
        ) : (
          <ReferralLink referralCode={profile.referral_code} />
        )}

        <div
          className="rounded-2xl border p-4"
          style={{ borderColor: `${colors.gold}33`, backgroundColor: `${colors.gold}0C` }}
        >
          <div className="flex items-center gap-2">
            <Gift className="size-4" style={{ color: colors.gold }} />
            <p className="text-sm font-bold" style={{ color: colors.ink }}>
              How it works
            </p>
          </div>
          <ol className="mt-3 space-y-2 text-xs leading-relaxed" style={{ color: `${colors.ink}77` }}>
            <li>1. Share your unique link with friends</li>
            <li>2. They sign up and start trading on SwiftyEX</li>
            <li>3. You earn commission &amp; climb referral tiers</li>
          </ol>
        </div>

        <LeaderBoard
          entries={referral.leaderboard}
          userRank={referral.rank}
          username={profile.username}
          userReferrals={referral.total_invited}
          userEarned={referral.total_earned}
        />
      </div>

      <BottomNav />
    </main>
  )
}

function StatPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div
      className="rounded-xl px-3 py-2.5 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(255,255,255,0.14)' }}
    >
      <div className="flex items-center gap-1.5 text-white/70">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-0.5 text-lg font-bold text-white">{value}</p>
    </div>
  )
}
