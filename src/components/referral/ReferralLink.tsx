'use client'

import { useCallback, useState } from 'react'
import { Check, Copy, Link2, Share2 } from 'lucide-react'
import { colors } from '@/lib/colors'
import { buildReferralLink } from '@/lib/referral'
import { useTelegram } from '@/hooks/useTelegram'

interface ReferralLinkProps {
  referralCode: string
}

export function ReferralLink({ referralCode }: ReferralLinkProps) {
  const { tg } = useTelegram()
  const [copied, setCopied] = useState(false)
  const link = buildReferralLink(referralCode)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(link)
      tg?.HapticFeedback?.impactOccurred('light')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }, [link, tg])

  const handleShare = useCallback(() => {
    const text = `Join me on SwiftyEX and trade crypto seamlessly! Use my link: ${link}`
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(
        `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`,
      )
    } else if (navigator.share) {
      navigator.share({ title: 'SwiftyEX Referral', text, url: link })
    } else {
      handleCopy()
    }
  }, [link, tg, handleCopy])

  return (
    <section
      className="rounded-2xl border p-5"
      style={{
        borderColor: `${colors.blue}22`,
        backgroundColor: colors.white,
        boxShadow: `0 4px 24px ${colors.ink}08`,
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${colors.blue}14` }}
        >
          <Link2 className="size-4" style={{ color: colors.blue }} />
        </div>
        <div>
          <h3 className="text-[15px] font-bold" style={{ color: colors.ink }}>
            Your referral link
          </h3>
          <p className="text-xs" style={{ color: `${colors.ink}55` }}>
            Share &amp; earn on every trade
          </p>
        </div>
      </div>

      <div
        className="mt-4 rounded-xl px-4 py-3"
        style={{ backgroundColor: `${colors.ink}06` }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: `${colors.ink}55` }}>
          Referral code
        </p>
        <p className="mt-1 font-mono text-xl font-bold tracking-widest" style={{ color: colors.ink }}>
          {referralCode}
        </p>
      </div>

      <p
        className="mt-3 truncate rounded-lg px-3 py-2 font-mono text-xs"
        style={{ backgroundColor: `${colors.teal}10`, color: colors.teal }}
      >
        {link}
      </p>

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition active:scale-[0.98]"
          style={{
            backgroundColor: copied ? colors.teal : colors.ink,
            boxShadow: copied ? `0 4px 16px ${colors.teal}44` : `0 4px 16px ${colors.ink}33`,
          }}
        >
          {copied ? (
            <>
              <Check className="size-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="size-4" />
              Copy link
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl border transition active:scale-[0.98]"
          style={{
            borderColor: `${colors.blue}33`,
            backgroundColor: `${colors.blue}0A`,
            color: colors.blue,
          }}
          aria-label="Share referral link"
        >
          <Share2 className="size-5" />
        </button>
      </div>
    </section>
  )
}
