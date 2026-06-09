'use client'

import { useMemo, useState } from 'react'
// import { SimulatedBadge } from '@/components/ui/SimulatedBadge'
import { colors } from '@/lib/colors'
import type { ChartPoint, ChartRange } from '@/lib/portfolio'
import { formatNgn, mockChartData } from '@/lib/portfolio'

const RANGES: ChartRange[] = ['W', 'M', '3M', '6M', 'Y', 'All']

interface PortfolioChartProps {
  totalNgn: number
}

function HatchedBar({
  x,
  y,
  width,
  height,
  selected,
}: {
  x: number
  y: number
  width: number
  height: number
  selected: boolean
}) {
  const id = `hatch-${x}-${y}`

  return (
    <g>
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.white} stopOpacity="0.95" />
          <stop offset="100%" stopColor={colors.white} stopOpacity="0" />
        </linearGradient>
        <pattern id={id} patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke={colors.blue} strokeWidth="1.5" opacity="0.45" />
        </pattern>
      </defs>

      {selected ? (
        <>
          <rect x={x} y={y} width={width} height={height} fill={colors.white} rx="2" />
          <rect x={x} y={y} width={width} height={height} fill={`url(#${id})`} rx="2" />
          <line
            x1={x}
            y1={y + height}
            x2={x + width}
            y2={y + height}
            stroke={colors.gold}
            strokeWidth="2.5"
          />
        </>
      ) : (
        <rect x={x} y={y} width={width} height={height} fill={`url(#grad-${id})`} rx="2" />
      )}
    </g>
  )
}

export function PortfolioChart({ totalNgn }: PortfolioChartProps) {
  const [range, setRange] = useState<ChartRange>('W')
  const [selectedIndex, setSelectedIndex] = useState(6)

  const data = useMemo(() => mockChartData(range, totalNgn), [range, totalNgn])

  const activeIndex = Math.min(selectedIndex, data.length - 1)
  const activePoint = data[activeIndex] ?? data[data.length - 1]

  const max = Math.max(...data.map((d) => d.value), 1)
  const avg = data.reduce((s, d) => s + d.value, 0) / data.length

  const chartHeight = 160
  const chartWidth = 320
  const padX = 8
  const padTop = 12
  const padBottom = 4
  const barGap = 10
  const barWidth = (chartWidth - padX * 2 - barGap * (data.length - 1)) / data.length
  const plotHeight = chartHeight - padTop - padBottom

  // Scale from 0 so the lowest bar is never collapsed to zero height
  const domainMax = max * 1.08

  const scaleY = (v: number) => {
    const normalized = Math.min(v / domainMax, 1)
    return padTop + plotHeight * (1 - normalized)
  }

  const barHeightFor = (v: number) => {
    const top = scaleY(v)
    return Math.max(chartHeight - padBottom - top, 3)
  }

  const avgY = scaleY(avg)

  return (
    <section
      className="px-5 pb-6 pt-3"
      style={{ backgroundColor: '#28231d' }}
    >
      {/* Range selector */}
      <div className="flex items-center justify-between gap-1">
        {RANGES.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => {
              setRange(r)
              const next = mockChartData(r, totalNgn)
              setSelectedIndex(next.length - 1)
            }}
            className="rounded-full px-2.5 py-1 text-xs font-semibold transition"
            style={{
              backgroundColor: range === r ? colors.white : 'transparent',
              color: range === r ? colors.ink : `${colors.white}B3`,
            }}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Selected value */}
      <div className="mt-4">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium" style={{ color: `${colors.white}CC` }}>
            {activePoint?.fullLabel}
          </p>
          {/* <SimulatedBadge label="Demo" className="!bg-white/15 !text-white/90" /> */}
        </div>
        <p
          className="mt-0.5 font-mono text-3xl font-bold tracking-tight"
          style={{ color: colors.white }}
        >
          {formatNgn(activePoint?.value ?? 0)}
        </p>
      </div>

      {/* Chart */}
      <div className="relative mt-2">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight + 28}`}
          className="w-full"
          role="img"
          aria-label="Portfolio value chart"
        >
          {/* Average reference line */}
          <line
            x1={padX}
            y1={avgY}
            x2={chartWidth - padX}
            y2={avgY}
            stroke={colors.gold}
            strokeWidth="1.5"
            strokeDasharray="5 4"
            opacity="0.85"
          />
          <text
            x={chartWidth - padX}
            y={avgY - 6}
            textAnchor="end"
            fill={colors.white}
            fontSize="9"
            fontWeight="600"
          >
            {formatNgn(avg, true)}
          </text>

          {/* Bars */}
          {data.map((point: ChartPoint, i) => {
            const x = padX + i * (barWidth + barGap)
            const barHeight = barHeightFor(point.value)
            const barTop = chartHeight - padBottom - barHeight
            const isActive = i === activeIndex

            return (
              <g
                key={`${range}-${point.label}`}
                onClick={() => setSelectedIndex(i)}
                className="cursor-pointer"
              >
                <HatchedBar
                  x={x}
                  y={barTop}
                  width={barWidth}
                  height={barHeight}
                  selected={isActive}
                />
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 18}
                  textAnchor="middle"
                  fill={isActive ? colors.white : `${colors.white}99`}
                  fontSize="11"
                  fontWeight={isActive ? 700 : 500}
                >
                  {point.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </section>
  )
}
