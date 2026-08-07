'use client'

import { useState } from 'react'

interface FinishMatchButtonProps {
  fixtureId: string
  participant1Name: string
  participant2Name: string
  participant1Id: string | null
  participant2Id: string | null
  isHeat?: boolean
  score1?: string | null
}

export default function FinishMatchButton({
  fixtureId,
  participant1Name,
  participant2Name,
  participant1Id,
  participant2Id,
  isHeat = false,
  score1,
}: FinishMatchButtonProps) {
  const [open, setOpen] = useState(false)
  const [selectedWinner, setSelectedWinner] = useState<string>(participant1Id || '')
  const [loading, setLoading] = useState(false)

  function detectHeatWinner(): string {
    if (!score1) return ''
    const first = score1.split(' | ').find(e => e.includes(': P1'))
    if (!first) return ''
    return first.replace(': P1', '').trim()
  }

  async function handleFinish(winnerId: string) {
    setLoading(true)
    try {
      const res = await fetch('/api/fixtures/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: fixtureId, winnerId }),
      })
      const data = await res.json()
      if (data.success) {
        window.location.reload()
      } else {
        alert('Failed to finish match. Please try again.')
      }
    } catch {
      alert('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (isHeat) {
    const winner = detectHeatWinner()
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {winner && (
          <div style={{
            padding: '10px 16px', borderRadius: '8px',
            background: 'rgba(76,175,80,0.12)', border: '1px solid rgba(76,175,80,0.3)',
          }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(165,214,167,0.8)' }}>
              🥇 Winner: <strong style={{ color: '#4CAF50' }}>{winner}</strong>
            </span>
          </div>
        )}
        <button
          type="button"
          disabled={loading}
          onClick={() => handleFinish(winner)}
          style={{
            padding: '11px 24px',
            background: loading ? 'rgba(255,152,0,0.2)' : 'rgba(255,152,0,0.15)',
            color: '#FF9800', fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '13px', fontWeight: '700', letterSpacing: '0.08em',
            border: '1px solid rgba(255,152,0,0.35)', borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '⏳ Finishing...' : '🏁 FINISH HEAT'}
        </button>
      </div>
    )
  }

  return (
    <div>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{
            padding: '11px 24px',
            background: 'rgba(255,152,0,0.15)', color: '#FF9800',
            fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px',
            fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase',
            border: '1px solid rgba(255,152,0,0.35)', borderRadius: '8px', cursor: 'pointer',
          }}
        >
          🏁 FINISH MATCH
        </button>
      ) : (
        <div style={{
          padding: '18px 20px', borderRadius: '12px',
          background: 'rgba(255,152,0,0.08)', border: '1px solid rgba(255,152,0,0.3)',
          display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap',
        }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', color: 'rgba(165,214,167,0.8)', fontWeight: '600', whiteSpace: 'nowrap' }}>
            Select Winner:
          </span>
          <select
            value={selectedWinner}
            onChange={e => setSelectedWinner(e.target.value)}
            style={{
              padding: '9px 14px', background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,152,0,0.4)', borderRadius: '8px',
              color: 'white', fontSize: '13px', fontFamily: 'Inter, sans-serif',
              cursor: 'pointer', outline: 'none', flex: 1, minWidth: '200px',
            }}
          >
            {participant1Id && <option value={participant1Id}>{participant1Name}</option>}
            {participant2Id && <option value={participant2Id}>{participant2Name}</option>}
          </select>
          <button
            type="button"
            disabled={loading || !selectedWinner}
            onClick={() => handleFinish(selectedWinner)}
            style={{
              padding: '9px 20px',
              background: loading ? 'rgba(255,152,0,0.2)' : '#FF9800',
              color: loading ? 'rgba(0,0,0,0.4)' : 'black',
              fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px',
              fontWeight: '700', border: 'none', borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '⏳ Saving...' : '✅ Confirm'}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            style={{
              padding: '9px 16px', background: 'transparent', color: 'rgba(165,214,167,0.5)',
              fontFamily: 'Inter, sans-serif', fontSize: '13px',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
