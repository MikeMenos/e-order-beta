type SpinnerProps = {
  size?: number
  className?: string
}

export function Spinner({ size = 32, className = "" }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`flex items-center justify-center ${className}`}
    >
      <div
        className="animate-spin rounded-full border-2 border-zinc-200 border-t-primary dark:border-zinc-700 dark:border-t-primary"
        style={{
          width: size,
          height: size,
        }}
      />
    </div>
  )
}
