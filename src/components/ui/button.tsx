import { type ButtonHTMLAttributes, type ForwardedRef, forwardRef } from 'react'
import { cn } from '../../lib/utils'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-accent text-text-primary shadow-lg shadow-accent/25 hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/30',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-border-subtle hover:bg-accent/10 hover:text-accent',
        secondary: 'bg-bg-secondary/50 text-text-primary hover:bg-bg-secondary/80',
        ghost: 'hover:bg-accent/10 hover:text-accent',
        link: 'text-accent underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-6 py-3',
        sm: 'h-9 rounded-lg px-4',
        lg: 'h-12 rounded-xl px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef(
  (
    { className, variant, size, ...props }: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
