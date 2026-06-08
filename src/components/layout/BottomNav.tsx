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
    icon: (active: boolean) => <TargetIcon active={active} />,
  },
  {
    href: '/referral',
    label: 'Profile',
    icon: (active: boolean) => <UserIcon active={active} />,
  },
  {
    href: '/actions',
    label: 'Actions',
    icon: (active: boolean) => <UserIcon active={active} />,
    }
] as const

function GridIcon({ active }: { active: boolean }) {
  const fill = active ? '#111111' : '#C4C4C4'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="8" height="8" rx="2" fill={fill} />
      <rect x="13" y="3" width="8" height="8" rx="2" fill={fill} />
      <rect x="3" y="13" width="8" height="8" rx="2" fill={fill} />
      <rect x="13" y="13" width="8" height="8" rx="2" fill={fill} />
    </svg>
  )
}

function TargetIcon({ active }: { active: boolean }) {
  const stroke = active ? '#111111' : '#C4C4C4'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="2" />
      <circle cx="12" cy="12" r="3" fill={active ? '#111111' : '#C4C4C4'} />
    </svg>
  )
}

function UserIcon({ active }: { active: boolean }) {
  const fill = active ? '#111111' : '#C4C4C4'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="4" fill={fill} />
      <path
        d="M5 20c0-3.866 3.134-7 7-7s7 3.134 7 7"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <nav className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <ul className="pointer-events-auto flex items-center gap-10 rounded-full bg-white px-10 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <li key={item.href}>
              <button
                type="button"
                onClick={() => router.push(item.href)}
                className="flex items-center justify-center transition-transform active:scale-95"
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
