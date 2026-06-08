import { EmptyState } from '@/components/ui/EmptyState'
import { AssetIconBadge } from '@/components/ui/AssetIcon'
import { holdingIdToAsset } from '@/lib/assets'
import { colors } from '@/lib/colors'
import type { Holding } from '@/lib/portfolio'
import { formatBalance, formatNgn } from '@/lib/portfolio'
import { PieChart } from 'lucide-react'

interface HoldingsListProps {
  holdings: Holding[]
  loading?: boolean
}

function HoldingRow({ holding }: { holding: Holding }) {
  const isCrypto = holding.id === 'btc'

  return (
    <li className="py-4">
      <div className="flex items-center gap-3.5">
        <AssetIconBadge
          asset={holdingIdToAsset(holding.id)}
          size={32}
          bgClassName="bg-white ring-1 ring-zinc-100"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-[13.5px] font-semibold" style={{ color: colors.ink }}>
              {holding.label}
            </p>
            <p
              className="shrink-0 font-mono text-[13.5px] font-semibold"
              style={{ color: colors.ink }}
            >
              {formatNgn(holding.valueNgn)}
            </p>
          </div>
          <p className="text-xs" style={{ color: `${colors.ink}55` }}>
            {holding.symbol}
            {formatBalance(holding.balance, isCrypto)}
          </p>

          <div
            className="mt-2.5 h-1.5 overflow-hidden rounded-full"
            style={{ backgroundColor: `${colors.ink}0D` }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${holding.percent}%`,
                backgroundColor: holding.color,
              }}
            />
          </div>
          <p
            className="mt-1 text-right text-[11px] font-medium"
            style={{ color: `${colors.ink}55` }}
          >
            {holding.percent.toFixed(1)}%
          </p>
        </div>
      </div>
    </li>
  )
}

export function HoldingsList({ holdings, loading }: HoldingsListProps) {
  return (
    <div>
      <h2 className="text-[17px] font-bold" style={{ color: colors.ink }}>
        Holdings
      </h2>
      <p className="mt-0.5 text-sm" style={{ color: `${colors.ink}55` }}>
        BTC, USD &amp; Naira breakdown
      </p>

      {loading ? (
        <div className="mt-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl"
              style={{ backgroundColor: `${colors.ink}0A` }}
            />
          ))}
        </div>
      ) : holdings.every((h) => h.valueNgn === 0) ? (
        <EmptyState
          icon={<PieChart className="size-6" />}
          title="No holdings yet"
          description="Deposit funds to your wallets to see allocation breakdown here."
        />
      ) : (
        <ul className="mt-2 divide-y" style={{ borderColor: `${colors.ink}0D` }}>
          {holdings.map((h) => (
            <HoldingRow key={h.id} holding={h} />
          ))}
        </ul>
      )}
    </div>
  )
}
