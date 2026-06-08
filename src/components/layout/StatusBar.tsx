'use client'

import { useRouter } from 'next/navigation'
import { Bell, Headphones } from 'lucide-react'
import { getGreeting } from '@/lib/format'
import { useAppStore } from '@/store/useAppStore'
import { useTelegram } from '@/hooks/useTelegram'

export function StatusBar() {
  const router = useRouter()
  const { user: tgUser } = useTelegram()
  const profile = useAppStore((s) => s.user)

  const firstName = profile?.first_name ?? tgUser?.first_name ?? 'there'
  const initial = firstName[0]?.toUpperCase() ?? 'S'

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-100/80 bg-white/80 px-5 py-3 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-violet-700 shadow-sm shadow-violet-200">
          <span className="text-sm font-bold text-white">{initial}</span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-zinc-900">
            {getGreeting()}, {firstName}
          </p>
          <p className="text-[11px] text-zinc-400">
            {profile?.kyc_verified ? 'Verified account' : 'Complete KYC to unlock limits'}
          </p>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <button
            type="button"
            aria-label="AI Assistant"
            onClick={() => router.push('/assistant')}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 transition hover:bg-zinc-200 active:scale-95"
          >
            <Headphones size={18} />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 transition hover:bg-zinc-200"
          >
            <Bell size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
