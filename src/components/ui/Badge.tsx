import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'jade' | 'rose' | 'gold' | 'sky'
  className?: string
}

const variantStyles = {
  default: 'bg-vio-dim text-vio-2',
  jade: 'bg-jade-dim text-jade',
  rose: 'bg-rose-dim text-rose',
  gold: 'bg-gold-dim text-gold',
  sky: 'bg-sky-dim text-sky',
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
