'use client'

import { useFormStatus } from 'react-dom'

interface DeleteAdminButtonProps {
  adminName: string
}

export default function DeleteAdminButton({ adminName }: DeleteAdminButtonProps) {
  const { pending } = useFormStatus()

  const handleDelete = (e: React.MouseEvent) => {
    if (!confirm(`Are you sure you want to delete ${adminName}?`)) {
      e.preventDefault()
    }
  }

  return (
    <button 
      type="submit"
      disabled={pending}
      onClick={handleDelete}
      style={{
        padding: '8px 16px',
        background: 'transparent',
        border: '1px solid rgba(239,68,68,0.3)',
        color: '#ef4444',
        borderRadius: '6px',
        cursor: pending ? 'not-allowed' : 'pointer',
        fontSize: '12px',
        fontWeight: '600',
        transition: 'all 0.3s',
        opacity: pending ? 0.5 : 1
      }}>
      {pending ? 'DELETING...' : 'DELETE'}
    </button>
  )
}
