import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '../../lib/utils'

function Card({ className, ...props }: ComponentPropsWithoutRef<'article'>) {
  return (
    <article
      className={cn('rounded-lg border border-zinc-200 bg-white p-5', className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: ComponentPropsWithoutRef<'header'>) {
  return <header className={cn('mb-4 space-y-1', className)} {...props} />
}

function CardTitle({ className, ...props }: ComponentPropsWithoutRef<'h2'>) {
  return (
    <h2
      className={cn('text-lg font-semibold tracking-normal text-zinc-950', className)}
      {...props}
    />
  )
}

function CardDescription({
  className,
  ...props
}: ComponentPropsWithoutRef<'p'>) {
  return <p className={cn('text-sm leading-6 text-zinc-500', className)} {...props} />
}

export { Card, CardDescription, CardHeader, CardTitle }
export default Card
