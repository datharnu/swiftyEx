interface LoaderProps {
  className?: string
}

export function Loader({ className = '' }: LoaderProps) {
  return (
    <div
      className={`h-6 w-6 animate-spin rounded-full border-2 border-vio border-t-transparent ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}
