import { useId } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '../../lib/utils'

type InputProps = ComponentPropsWithoutRef<'input'> & {
  error?: string
  label?: string
}

function Input({ className, error, id, label, ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id || generatedId

  return (
    <label className="field" htmlFor={inputId}>
      {label && <span>{label}</span>}
      <input
        aria-invalid={Boolean(error)}
        className={cn(className)}
        id={inputId}
        {...props}
      />
      {error && (
        <span className="form-message error" role="alert">
          {error}
        </span>
      )}
    </label>
  )
}

export default Input
