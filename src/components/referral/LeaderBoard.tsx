'use client'

import { Medal, Trophy, Users } from 'lucide-react'
import { colors } from '@/lib/colors'
import { formatEarnings } from '@/lib/referral'
import type { LeaderboardEntry } from '@/types'

interface LeaderBoardProps {
  entries: LeaderboardEntry[]
  userRank: number
  username: string
  userReferrals: number
  userEarned: string
}

const PODIUM_STYLES = [
  { medal: colors.gold, bg: `${colors.gold}18`, border: `${colors.gold}44` },
  { medal: '#C0C0C0', bg: `${colors.ink}08`, border: `${colors.ink}18` },
  { medal: '#CD7F32', bg: `${colors.teal}12`, border: `${colors.teal}28` },
]

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    const style = PODIUM_STYLES[rank - 1]
    return (
      <div
        className="flex h-8 w-8 items-center justify-center rounded-full"
        style={{ backgroundColor: style.bg, border: `1.5px solid ${style.border}` }}
      >
        <Medal className="size-4" style={{ color: style.medal }} />
      </div>
    )
  }

  return (
    <div
      className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
      style={{ backgroundColor: `${colors.ink}08`, color: `${colors.ink}66` }}
    >
      {rank}
    </div>
  )
}

function LeaderboardRow({
  rank,
  username,
  referrals,
  earned,
  highlighted,
}: {
  rank: number
  username: string
  referrals: number
  earned: string
  highlighted?: boolean
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-3 py-3 transition"
      style={{
        backgroundColor: highlighted ? `${colors.blue}10` : 'transparent',
        border: highlighted ? `1.5px solid ${colors.blue}33` : '1.5px solid transparent',
        boxShadow: highlighted ? `0 4px 16px ${colors.blue}14` : 'none',
      }}
    >
      <RankBadge rank={rank} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold" style={{ color: colors.ink }}>
          {username}
          {highlighted && (
            <span
              className="ml-2 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase"
              style={{ backgroundColor: `${colors.blue}18`, color: colors.blue }}
            >
              You
            </span>
          )}
        </p>
        <p className="text-xs" style={{ color: `${colors.ink}55` }}>
          {referrals} referral{referrals === 1 ? '' : 's'}
        </p>
      </div>
      <p className="shrink-0 text-sm font-bold" style={{ color: colors.teal }}>
        {formatEarnings(earned)}
      </p>
    </div>
  )
}

export function LeaderBoard({
  entries,
  userRank,
  username,
  userReferrals,
  userEarned,
}: LeaderBoardProps) {
  const userInTop10 = userRank <= 10

  return (
    <section
      className="rounded-2xl border p-5"
      style={{
        borderColor: `${colors.ink}10`,
        backgroundColor: colors.white,
        boxShadow: `0 4px 24px ${colors.ink}06`,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${colors.gold}22` }}
          >
            <Trophy className="size-4" style={{ color: colors.gold }} />
          </div>
          <div>
            <h3 className="text-[15px] font-bold" style={{ color: colors.ink }}>
              Leaderboard
            </h3>
            <p className="text-xs" style={{ color: `${colors.ink}55` }}>
              Top referrers this month
            </p>
          </div>
        </div>
        <div
          className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold"
          style={{ backgroundColor: `${colors.teal}12`, color: colors.teal }}
        >
          <Users className="size-3" />
          Live
        </div>
      </div>

      <div className="mt-4 space-y-1">
        {entries.slice(0, 10).map((entry, i) => (
          <LeaderboardRow
            key={entry.username}
            rank={i + 1}
            username={entry.username}
            referrals={entry.referrals}
            earned={entry.earned}
            highlighted={userInTop10 && entry.username === username}
          />
        ))}
      </div>

      {!userInTop10 && (
        <>
          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1" style={{ backgroundColor: `${colors.ink}12` }} />
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: `${colors.ink}44` }}
            >
              Your rank
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: `${colors.ink}12` }} />
          </div>
          <LeaderboardRow
            rank={userRank}
            username={username}
            referrals={userReferrals}
            earned={userEarned}
            highlighted
          />
        </>
      )}
    </section>
  )
}
