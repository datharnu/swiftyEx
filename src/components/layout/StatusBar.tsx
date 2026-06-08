'use client'

import { useTelegram } from '@/hooks/useTelegram'
import { Bell, Headphones } from 'lucide-react'

export function StatusBar() {
  const { user } = useTelegram()

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-100/80 bg-transparent px-5 py-3 backdrop-blur-md">
      <div className="flex items-center gap-2 ">
   
      <div className="h-9 w-9 flex-shrink-0 rounded-full bg-violet-600 flex items-center justify-center">
  <span className="text-sm font-bold text-white">
    {user?.first_name?.[0] ?? 'S'}
  </span>
</div>
        {/* User name and greeting */}
<div className=''>
      <p className="text-sm font-bold text-black ">
      {user ? `Hi, ${user.first_name} 👋` : 'Hi there 👋'}
      </p>
</div>

{/* support and notification icons */}
<div className="ml-auto flex items-center gap-5">
  <button type="button" aria-label="Support" className="text-black">
    <Headphones size={20} />
  </button>
  <button type="button" aria-label="Notifications (2 unread)" className="relative text-black">
    <Bell size={20} />
    <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose px-1 text-[10px] font-semibold leading-none text-white">
      2
    </span>
  </button>
</div>
      </div>
    </header>
  )
}
