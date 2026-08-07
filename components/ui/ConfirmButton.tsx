'use client'

import React from 'react'

interface ConfirmButtonProps {
  message: string
  style?: React.CSSProperties
  className?: string
  children: React.ReactNode
}

export default function ConfirmButton({
  message,
  style,
  className,
  children
}: ConfirmButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!window.confirm(message)) {
      e.preventDefault()
    }
  }

  return (
    <button
      type="submit"
      onClick={handleClick}
      style={style}
      className={className}
    >
      {children}
    </button>
  )
}
