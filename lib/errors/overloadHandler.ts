export class OverloadError extends Error {
  constructor(message = 'Server is temporarily overloaded. Please try again.') {
    super(message)
    this.name = 'OverloadError'
  }
}

export function handleDatabaseError(error: unknown): Error {
  const err = error as any
  if (err?.code === 'P2024') return new OverloadError('Database connection timeout.')
  if (err?.message?.includes('timeout')) return new OverloadError('Request timed out.')
  if (err?.code === 'P2002') return new Error('Duplicate entry detected.')
  return err instanceof Error ? err : new Error('Unknown error')
}
