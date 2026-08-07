'use client'

import { startTransition } from 'react'

interface Props {
  id: string
  status: string
  updateStatusAction: (formData: FormData) => Promise<void>
}

export default function RegistrationStatusSelect({ id, status, updateStatusAction }: Props) {
  // Custom dropdown SVG arrows escaped for CSS
  const getArrowSvg = (color: string) => {
    return `url("data:image/svg+xml;utf8,<svg fill='${encodeURIComponent(color)}' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18'><path d='M7 10l5 5 5-5z'/></svg>")`
  }

  const badgeColor = status === 'approved' 
    ? '#4CAF50' 
    : status === 'rejected'
    ? '#ef4444'
    : '#FF9800'

  const bgAlpha = status === 'approved' 
    ? 'rgba(76,175,80,0.12)' 
    : status === 'rejected'
    ? 'rgba(239,68,68,0.12)'
    : 'rgba(255,152,0,0.12)'

  const borderColor = status === 'approved' 
    ? 'rgba(76,175,80,0.3)' 
    : status === 'rejected'
    ? 'rgba(239,68,68,0.3)'
    : 'rgba(255,152,0,0.3)'

  return (
    <form action={updateStatusAction} style={{ margin: 0 }}>
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={status}
        onChange={(e) => {
          const form = e.currentTarget.form
          if (form) {
            startTransition(() => {
              form.requestSubmit()
            })
          }
        }}
        style={{
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          padding: '8px 32px 8px 16px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '600',
          background: `${bgAlpha} ${getArrowSvg(badgeColor)} no-repeat right 10px center`,
          color: badgeColor,
          border: `1px solid ${borderColor}`,
          cursor: 'pointer',
          outline: 'none',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        }}
      >
        <option value="pending" style={{ background: '#121212', color: '#FF9800' }}>Pending</option>
        <option value="approved" style={{ background: '#121212', color: '#4CAF50' }}>Approved</option>
        <option value="rejected" style={{ background: '#121212', color: '#ef4444' }}>Rejected</option>
      </select>
    </form>
  )
}

