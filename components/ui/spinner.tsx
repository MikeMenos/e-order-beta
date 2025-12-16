type SpinnerProps = {
  size?: number
  className?: string
}

export function Spinner({ size = 32, className = "" }: SpinnerProps) {
  return (
    <div
      className={`relative animate-spin ${className}`}
      style={{ width: size, height: size }}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 h-[20%] w-[6%] origin-bottom rounded-full bg-zinc-700 dark:bg-zinc-300"
          style={{
            transform: `rotate(${i * 30}deg) translateY(-150%)`,
            opacity: (i + 1) / 12,
          }}
        />
      ))}
    </div>
  )
}
