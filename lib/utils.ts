import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, fmt = 'dd MMM yyyy') {
  const { format } = require('date-fns')
  return format(new Date(date), fmt)
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
