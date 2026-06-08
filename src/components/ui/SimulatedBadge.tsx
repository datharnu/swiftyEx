interface SimulatedBadgeProps {
  label?: string
  className?: string
}

/** Marks UI sections powered by simulated hackathon demo data */
export function SimulatedBadge({
  label = 'Demo',
  className = '',
}: SimulatedBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800 ${className}`}
      title="Simulated data — no API endpoint yet"
    >
      {label}
    </span>
  )
}
