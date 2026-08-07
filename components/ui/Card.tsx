import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export const Card = ({ children, className, hover = true }: CardProps) => {
  return (
    <div
      className={cn(
        'glass p-6 overflow-hidden',
        hover && 'glass-hover',
        className
      )}
    >
      {children}
    </div>
  )
}
