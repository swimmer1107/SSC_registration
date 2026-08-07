'use client'
import { useRouter, usePathname } from 'next/navigation'

interface AdminFiltersProps {
  sports: { id: string; name: string }[]
  currentSport?: string
  currentStatus?: string
  showStatusFilter?: boolean
  basePath: string
}

export default function AdminFilters({
  sports,
  currentSport,
  currentStatus,
  showStatusFilter = true,
  basePath,
}: AdminFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search)
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
      <select
        value={currentSport || ''}
        onChange={(e) => handleChange('sport', e.target.value)}
        style={{
          padding: '12px 20px',
          background: 'rgba(27,94,32,0.1)',
          border: '1px solid rgba(76,175,80,0.3)',
          borderRadius: '8px',
          color: 'white',
          fontSize: '14px',
          cursor: 'pointer',
        }}
      >
        <option value="">All Sports</option>
        {sports.map(s => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      {showStatusFilter && (
        <select
          value={currentStatus || ''}
          onChange={(e) => handleChange('status', e.target.value)}
          style={{
            padding: '12px 20px',
            background: 'rgba(27,94,32,0.1)',
            border: '1px solid rgba(76,175,80,0.3)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          <option value="">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="live">Live Now</option>
        </select>
      )}
    </div>
  )
}
