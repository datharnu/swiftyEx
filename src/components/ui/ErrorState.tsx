import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
        <AlertCircle className="size-6" />
      </div>
      <p className="text-[15px] font-semibold text-zinc-900">Unable to load</p>
      <p className="mt-1.5 max-w-[260px] text-sm text-zinc-400">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition active:scale-[0.98]"
        >
          <RefreshCw className="size-4" />
          Try again
        </button>
      )}
    </div>
  )
}
