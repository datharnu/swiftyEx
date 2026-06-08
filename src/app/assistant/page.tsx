'use client'

import { BottomNav } from '@/components/layout/BottomNav'
import { StatusBar } from '@/components/layout/StatusBar'
import { ChatInterface } from '@/components/assistant/ChatInterface'

export default function AssistantPage() {
  return (
    <main className="min-h-screen bg-white">
      <StatusBar />

      {/* <div className="border-b border-zinc-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 text-white shadow-lg shadow-violet-200">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h1 className="text-[17px] font-bold text-zinc-900">SwiftyEx Assistant</h1>
            <p className="text-xs text-zinc-400">AI-powered help for crypto &amp; trading</p>
          </div>
        </div>
      </div> */}

      <ChatInterface />
      <BottomNav />
    </main>
  )
}
