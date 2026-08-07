import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-green-500 text-green-950 hover:bg-green-400 shadow-green-glow',
      outline: 'border-2 border-green-500 text-green-500 hover:bg-green-500/10',
      ghost: 'text-green-300 hover:bg-green-500/10',
    }
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base font-accent uppercase tracking-wider',
      lg: 'px-8 py-4 text-lg font-accent uppercase tracking-widest',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
