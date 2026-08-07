import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import ExcelJS from 'exceljs'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sport = searchParams.get('sport')

  const results = await prisma.fixture.findMany({
    where: {
      status: 'completed',
      ...(sport && { sportId: sport }),
    },
    include: {
      sport: true,
      participant1: { include: { student: true } },
      participant2: { include: { student: true } },
    },
  })

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Results')

  worksheet.columns = [
    { header: 'Fixture #', key: 'fixtureNumber', width: 15 },
    { header: 'Sport', key: 'sport', width: 20 },
    { header: 'Stage', key: 'stage', width: 20 },
    { header: 'Team 1', key: 'team1', width: 25 },
    { header: 'Score 1', key: 'score1', width: 12 },
    { header: 'Team 2', key: 'team2', width: 25 },
    { header: 'Score 2', key: 'score2', width: 12 },
    { header: 'Winner', key: 'winner', width: 25 },
    { header: 'Date', key: 'date', width: 15 },
  ]

  results.forEach((r) => {
    worksheet.addRow({
      fixtureNumber: r.fixtureNumber,
      sport: r.sport.name,
      stage: r.stage,
      team1: r.participant1Name,
      score1: r.score1,
      team2: r.participant2Name,
      score2: r.score2,
      winner: r.winnerId === r.participant1Id ? r.participant1Name : r.participant2Name,
      date: new Date(r.updatedAt).toLocaleDateString(),
    })
  })

  // Styling
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4CAF50' },
  }

  const buffer = await workbook.xlsx.writeBuffer()
  const filename = `AAGAAZ-Results-${new Date().toISOString().split('T')[0]}.xlsx`

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
