'use client'

import { Activity, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTelegram } from '@/hooks/useTelegram'
import { colors } from '@/lib/colors'
import { motion } from 'framer-motion'

export function PulseEntryCard() {
  const router = useRouter()
  const { tg } = useTelegram()

  const handlePlay = () => {
    tg?.HapticFeedback?.impactOccurred('light')
    router.push('/pulse')
  }

  return (
    <section className="px-6 py-2">
      <motion.div
        onClick={handlePlay}
        whileTap={{ scale: 0.98 }}
        className="relative overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-r from-violet-500/10 to-indigo-500/5 p-4 shadow-[0_8px_24px_rgba(0,0,0,0.04)] backdrop-blur-xl cursor-pointer transition-all hover:bg-violet-500/15"
      >
        {/* Glow backdrop decoration */}
        <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-violet-500/20 blur-[15px]" />
        
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Pulsating Icon container */}
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-600/10 text-violet-600 border border-violet-600/20 shadow-[0_4px_12px_rgba(124,58,237,0.1)]">
              <Activity size={20} className="animate-pulse" />
              {/* Pulsating dot indicator */}
              <div className="absolute right-1 top-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold tracking-tight" style={{ color: colors.ink }}>
                  Swifty Pulse
                </h3>
                <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white">
                  PLAY
                </span>
              </div>
              <p className="mt-1 text-[11px] font-medium leading-normal text-zinc-500">
                Predict USD/NGN rates over 30s intervals. Win +10 points!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 text-violet-600">
            <ChevronRight size={18} className="stroke-[2.5]" />
          </div>
        </div>
      </motion.div>
    </section>
  )
}
