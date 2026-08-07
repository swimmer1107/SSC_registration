import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

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
    orderBy: { updatedAt: 'desc' },
  })

  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  
  let page = pdfDoc.addPage([600, 800])
  const { width, height } = page.getSize()
  
  let y = height - 50

  // Header
  page.drawText('AAGAAZ 2026 - MATCH RESULTS', {
    x: 50,
    y,
    size: 24,
    font: boldFont,
    color: rgb(0.105, 0.368, 0.125), // Dark Green
  })
  y -= 30

  page.drawText(`Generated on: ${new Date().toLocaleString()}`, {
    x: 50,
    y,
    size: 10,
    font,
    color: rgb(0.5, 0.5, 0.5),
  })
  y -= 40

  // Table Header
  const drawRow = (p: any, items: string[], currY: number, isHeader = false) => {
    const xPos = [50, 150, 250, 450, 520]
    items.forEach((item, i) => {
      p.drawText(item || '', {
        x: xPos[i],
        y: currY,
        size: isHeader ? 10 : 9,
        font: isHeader ? boldFont : font,
        color: isHeader ? rgb(0, 0, 0) : rgb(0.2, 0.2, 0.2),
      })
    })
  }

  drawRow(page, ['Fixture', 'Sport', 'Match', 'Score', 'Date'], y, true)
  y -= 20
  page.drawLine({
    start: { x: 50, y: y + 5 },
    end: { x: 550, y: y + 5 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  })

  results.forEach((r) => {
    if (y < 50) {
      page = pdfDoc.addPage([600, 800])
      y = 750
      drawRow(page, ['Fixture', 'Sport', 'Match', 'Score', 'Date'], y, true)
      y -= 20
    }
    
    const matchText = `${r.participant1Name} vs ${r.participant2Name}`
    const scoreText = `${r.score1} - ${r.score2}`
    const dateText = new Date(r.updatedAt).toLocaleDateString()
    
    drawRow(page, [r.fixtureNumber, r.sport.name, matchText, scoreText, dateText], y)
    y -= 20
  })

  const pdfBytes = await pdfDoc.save()
  const filename = `AAGAAZ-Results-${new Date().toISOString().split('T')[0]}.pdf`

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
