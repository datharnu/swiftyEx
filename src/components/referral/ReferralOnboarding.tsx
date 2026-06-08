import { Gift, Share2, Users } from 'lucide-react'
import { colors } from '@/lib/colors'

const STEPS = [
  {
    icon: <Share2 className="size-4" />,
    title: 'Share your link',
    description: 'Send your unique referral code to friends on Telegram.',
  },
  {
    icon: <Users className="size-4" />,
    title: 'Friends join & trade',
    description: 'They sign up on SwiftyEx and start buying or selling crypto.',
  },
  {
    icon: <Gift className="size-4" />,
    title: 'You earn rewards',
    description: 'Get commission on every trade your referrals make.',
  },
]

export function ReferralOnboarding() {
  return (
    <section
      className="rounded-2xl border p-5"
      style={{
        borderColor: `${colors.gold}33`,
        background: `linear-gradient(160deg, ${colors.gold}0C 0%, ${colors.white} 60%)`,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl" aria-hidden>🎁</span>
        <div>
          <h3 className="text-[15px] font-bold" style={{ color: colors.ink }}>
            Start earning today
          </h3>
          <p className="text-xs" style={{ color: `${colors.ink}55` }}>
            Three simple steps to referral rewards
          </p>
        </div>
      </div>

      <ol className="mt-4 space-y-3">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
              style={{ backgroundColor: `${colors.blue}14`, color: colors.blue }}
            >
              {i + 1}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span style={{ color: colors.gold }}>{step.icon}</span>
                <p className="text-sm font-semibold" style={{ color: colors.ink }}>
                  {step.title}
                </p>
              </div>
              <p className="mt-0.5 text-xs leading-relaxed" style={{ color: `${colors.ink}66` }}>
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
