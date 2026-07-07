import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '../../lib/utils'

type BadgeTone = 'neutral' | 'red' | 'blue' | 'success'

type BadgeProps = ComponentPropsWithoutRef<'span'> & {
  tone?: BadgeTone
}

const toneClasses: Record<BadgeTone, string> = {
  blue: 'border-blue-200 bg-blue-50 text-blue-700',
  neutral: 'border-zinc-200 bg-white text-zinc-600',
  red: 'border-rose-200 bg-rose-50 text-rose-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}

function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center rounded-md border px-2 text-xs font-semibold',
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  )
}

export default Badge
