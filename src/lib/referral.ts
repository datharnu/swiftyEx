import { colors } from './colors'

export type ReferralTierId = 'swiftling' | 'swiftrunner' | 'swiftlord' | 'elite'

export interface ReferralTier {
  id: ReferralTierId
  name: string
  minReferrals: number
  color: string
  glow: string
}

export const REFERRAL_TIERS: ReferralTier[] = [
  { id: 'swiftling', name: 'Swiftling', minReferrals: 0, color: colors.teal, glow: `${colors.teal}33` },
  { id: 'swiftrunner', name: 'Swiftrunner', minReferrals: 5, color: colors.blue, glow: `${colors.blue}33` },
  { id: 'swiftlord', name: 'Swiftlord', minReferrals: 15, color: colors.gold, glow: `${colors.gold}44` },
  { id: 'elite', name: 'Elite', minReferrals: 50, color: colors.gold, glow: `${colors.gold}55` },
]

export function getCurrentTier(referralCount: number): ReferralTier {
  let tier = REFERRAL_TIERS[0]
  for (const t of REFERRAL_TIERS) {
    if (referralCount >= t.minReferrals) tier = t
  }
  return tier
}

export function getTierProgress(referralCount: number) {
  const currentTier = getCurrentTier(referralCount)
  const currentIndex = REFERRAL_TIERS.findIndex((t) => t.id === currentTier.id)
  const nextTier = REFERRAL_TIERS[currentIndex + 1] ?? null

  if (!nextTier) {
    return {
      currentTier,
      nextTier: null,
      progress: 100,
      remaining: 0,
    }
  }

  const span = nextTier.minReferrals - currentTier.minReferrals
  const filled = referralCount - currentTier.minReferrals
  const progress = Math.min(100, Math.max(0, (filled / span) * 100))
  const remaining = Math.max(0, nextTier.minReferrals - referralCount)

  return { currentTier, nextTier, progress, remaining }
}

export function buildReferralLink(code: string): string {
  const bot = process.env.NEXT_PUBLIC_BOT_USERNAME ?? 'SwiftyEXBot'
  return `https://t.me/${bot}?start=${code}`
}

export function formatEarnings(amount: string | number): string {
  const n = typeof amount === 'string' ? Number(amount) : amount
  if (Number.isNaN(n)) return '₦0'
  return `₦${n.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`
}
