'use client'

import Image from 'next/image'
import { getAssetIcon, normalizeAssetId } from '@/lib/assets'

interface AssetIconProps {
  asset: string
  size?: number
  className?: string
  alt?: string
}

export function AssetIcon({
  asset,
  size = 32,
  className = '',
  alt,
}: AssetIconProps) {
  const id = normalizeAssetId(asset)
  const src = getAssetIcon(asset)
  const label = alt ?? id

  return (
    <Image
      src={src}
      alt={label}
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      unoptimized
    />
  )
}

interface AssetIconBadgeProps extends AssetIconProps {
  bgClassName?: string
}

/** Icon inside a rounded container — for lists and pickers */
export function AssetIconBadge({
  asset,
  size = 32,
  className = '',
  bgClassName = 'bg-zinc-100',
}: AssetIconBadgeProps) {
  const iconSize = Math.round(size * 0.68)

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full ${bgClassName} ${className}`}
      style={{ width: size, height: size }}
    >
      <AssetIcon asset={asset} size={iconSize} />
    </div>
  )
}
