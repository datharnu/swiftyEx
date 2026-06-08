'use client'

import { useCallback, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { useTelegram } from '@/hooks/useTelegram'

interface CopyButtonProps {
  text: string
  label?: string
  className?: string
  variant?: 'icon' | 'button'
}

export function CopyButton({
  text,
  label = 'Copy',
  className = '',
  variant = 'button',
}: CopyButtonProps) {
  const { tg } = useTelegram()
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      tg?.HapticFeedback?.impactOccurred('light')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }, [text, tg])

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? 'Copied' : label}
        className={`flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition hover:bg-zinc-200 active:scale-95 ${className}`}
      >
        {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition active:scale-[0.98] ${className}`}
    >
      {copied ? (
        <>
          <Check className="size-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="size-4" />
          {label}
        </>
      )}
    </button>
  )
}
