import type { ReactNode } from 'react'

interface CardProps {
  children?: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded-2xl border border-ink-4 bg-ink-3 p-4 ${className}`}>
      {children}
    </div>
  )
}
