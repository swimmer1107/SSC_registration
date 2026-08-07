import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import PDFDocument from 'pdfkit'

export async function GET() {
  try {
    const fixtures = await prisma.fixture.findMany({
      include: {
        sport: true,
      },
      orderBy: { fixtureNumber: 'asc' },
    })

    // Create PDF
    const doc = new PDFDocument({ margin: 50 })
    const chunks: Buffer[] = []

    doc.on('data', (chunk) => chunks.push(chunk))

    // Header
    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .fillColor('#1B5E20')
      .text('AAGAAZ 2026 - FIXTURES', { align: 'center' })

    doc.moveDown()
    doc
      .fontSize(12)
      .fillColor('#666666')
      .text('GLA University Sports Festival', { align: 'center' })

    doc.moveDown(2)

    // Table header
    const tableTop = 150
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#1B5E20')

    doc.text('Fixture', 50, tableTop)
    doc.text('Sport', 120, tableTop)
    doc.text('Stage', 220, tableTop)
    doc.text('Participants', 320, tableTop)
    doc.text('Status', 480, tableTop)

    doc
      .moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke('#4CAF50')

    // Table rows
    let y = tableTop + 25
    doc.fontSize(9).font('Helvetica').fillColor('#000000')

    fixtures.forEach((fix, i) => {
      if (y > 700) {
        doc.addPage()
        y = 50
      }

      doc.text(fix.fixtureNumber, 50, y)
      doc.text(fix.sport.name, 120, y)
      doc.text(fix.stage, 220, y)
      doc.text(`${fix.participant1Name} vs ${fix.participant2Name}`, 320, y, { width: 150 })
      doc.text(fix.status.toUpperCase(), 480, y)

      y += 30
    })

    doc.end()

    const buffer = await new Promise<Buffer>((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(chunks))
      })
    })

    const date = new Date().toISOString().split('T')[0]
    const filename = `AAGAAZ-Fixtures-${date}.pdf`

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('PDF export error:', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
