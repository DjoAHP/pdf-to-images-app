import { type ButtonHTMLAttributes, type ForwardedRef, forwardRef } from 'react'
import { cn } from '../../lib/utils'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ring-offset-background disabled:opacity-50 disabled:pointer-events-none disabled:cursor-default cursor-pointer rounded-full select-none',
  {
    variants: {
      variant: {
        default: 'bg-accent text-bg-primary shadow-lg shadow-accent/25 hover:bg-accent-secondary hover:shadow-xl hover:shadow-accent/30 active:scale-[0.98]',
        destructive: 'bg-error text-white hover:bg-error/90 shadow-lg shadow-error/25',
        outline: 'border border-border-subtle hover:border-accent/50 hover:bg-accent/5 hover:text-accent',
        secondary: 'bg-bg-tertiary text-text-primary hover:bg-bg-tertiary/80 border border-border-subtle/50',
        ghost: 'hover:bg-accent/10 hover:text-accent',
        link: 'text-accent underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-6 py-3 text-sm',
        sm: 'h-9 rounded-xl px-4 text-xs',
        lg: 'h-13 rounded-2xl px-8 text-base',
        xl: 'h-14 rounded-2xl px-10 text-base',
        icon: 'h-11 w-11 rounded-2xl',
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