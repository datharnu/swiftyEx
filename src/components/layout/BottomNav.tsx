'use client'

import { usePathname, useRouter } from 'next/navigation'

const navItems = [
  {
    href: '/',
    label: 'Home',
    icon: (active: boolean) => <GridIcon active={active} />,
  },
  {
    href: '/portfolio',
    label: 'Portfolio',
    icon: (active: boolean) => <ChartIcon active={active} />,
  },
  {
    href: '/actions',
    label: 'Actions',
    icon: (active: boolean) => <WorkflowIcon active={active} />,
  },
  {
    href: '/referral',
    label: 'Earn',
    icon: (active: boolean) => <GiftIcon active={active} />,
  },
] as const

function GridIcon({ active }: { active: boolean }) {
  const fill = active ? '#EED868' : '#C4C4C4'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="8" height="8" rx="2" fill={fill} />
      <rect x="13" y="3" width="8" height="8" rx="2" fill={fill} />
      <rect x="3" y="13" width="8" height="8" rx="2" fill={fill} />
      <rect x="13" y="13" width="8" height="8" rx="2" fill={fill} />
    </svg>
  )
}

function ChartIcon({ active }: { active: boolean }) {
  const stroke = active ? '#377CC8' : '#C4C4C4'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 20V10M10 20V4M16 20v-6M22 20V8" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// function SparkleIcon({ active }: { active: boolean }) {
//   const fill = active ? '#7C3AED' : '#C4C4C4'
//   return (
//     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
//       <path
//         d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z"
//         fill={fill}
//       />
//       <path d="M19 14l.8 2.8L22.5 18l-2.7.7L19 21.5l-.8-2.8L15.5 18l2.7-.7L19 14z" fill={fill} opacity={active ? 1 : 0.6} />
//     </svg>
//   )
// }

function WorkflowIcon({ active }: { active: boolean }) {
  const fill = active ? '#7C3AED' : '#C4C4C4'

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      {/* Top node */}
      <circle cx="6" cy="6" r="2" fill={fill} />

      {/* Bottom node */}
      <circle cx="18" cy="18" r="2" fill={fill} />

      {/* Middle node */}
      <circle cx="18" cy="6" r="2" fill={fill} />

      {/* Connection lines */}
      <path
        d="M8 6h8M18 8v8M8 6c0 4 4 8 8 8"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={active ? 1 : 0.6}
      />
    </svg>
  )
}

function GiftIcon({ active }: { active: boolean }) {
  const stroke = active ? '#469B88' : '#C4C4C4'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="10" width="18" height="11" rx="2" stroke={stroke} strokeWidth="2" />
      <path d="M12 10v11M3 14h18" stroke={stroke} strokeWidth="2" />
      <path d="M12 10c-2-3-4-4-6-2s0 4 3 4h3M12 10c2-3 4-4 6-2s0 4-3 4h-3" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <nav className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <ul className="pointer-events-auto flex items-center gap-10 rounded-full bg-white px-8 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <li key={item.href}>
              <button
                type="button"
                onClick={() => router.push(item.href)}
                className="flex flex-col items-center justify-center gap-0.5 transition-transform active:scale-95"
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.icon(isActive)}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
