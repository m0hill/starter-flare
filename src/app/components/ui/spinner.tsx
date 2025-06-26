import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import type React from 'react'
import { cn } from '@/app/lib/utils'

const spinnerVariants = cva('animate-spin text-foreground', {
  variants: {
    variant: {
      default: 'text-primary',
      destructive: 'text-destructive',
      secondary: 'text-secondary-foreground',
      muted: 'text-muted-foreground',
      accent: 'text-accent-foreground',
      'primary-foreground': 'text-primary-foreground',
      white: 'text-white',
    },
    size: {
      default: 'size-8',
      sm: 'size-4',
      lg: 'size-12',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  show?: boolean
  className?: string
  children?: React.ReactNode
}

export function Spinner({ show = true, children, className, variant, size }: SpinnerProps) {
  return (
    <span className={cn('flex-col items-center justify-center', show ? 'flex' : 'hidden')}>
      <Loader2 className={cn(spinnerVariants({ variant, size }), className)} />
      {children}
    </span>
  )
}
