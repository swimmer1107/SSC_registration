'use client'

export default function DeleteSportButton({
  sportId,
  sportName,
  deleteSport,
}: {
  sportId: string
  sportName: string
  deleteSport: (formData: FormData) => Promise<void>
}) {
  return (
    <form action={deleteSport}>
      <input type="hidden" name="id" value={sportId} />
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm(`Delete ${sportName}?`)) e.preventDefault()
        }}
        style={{
          padding: '8px 12px',
          background: 'rgba(239,68,68,0.15)',
          color: '#ef4444',
          border: 'none',
          borderRadius: '6px',
          fontSize: '12px',
          cursor: 'pointer',
        }}
      >
        🗑️
      </button>
    </form>
  )
}
