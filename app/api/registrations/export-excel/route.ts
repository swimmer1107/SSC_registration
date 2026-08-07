import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import ExcelJS from 'exceljs'

export async function GET() {
  try {
    // Fetch all registrations with proper schema relations
    const registrations = await prisma.registration.findMany({
      include: {
        student: true,
        sport: true,
        registrationMembers: {
          include: {
            student: true,
          },
        },
      },
      orderBy: { registeredAt: 'desc' },
    })

    // Create workbook
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Registrations')

    // Define columns
    worksheet.columns = [
      { header: 'Reg ID', key: 'regId', width: 15 },
      { header: 'Student Name', key: 'studentName', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'College', key: 'college', width: 30 },
      { header: 'Course', key: 'course', width: 20 },
      { header: 'Year', key: 'year', width: 10 },
      { header: 'Sport', key: 'sport', width: 20 },
      { header: 'Type', key: 'type', width: 12 },
      { header: 'Team Name', key: 'teamName', width: 25 },
      { header: 'Team Members', key: 'teamMembers', width: 40 },
      { header: 'Payment Amount', key: 'paymentAmount', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Registered Date', key: 'registeredDate', width: 20 },
    ]

    // Style header row
    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1B5E20' },
    }
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
    headerRow.height = 25

    // Add data rows
    registrations.forEach((reg, index) => {
      const row = worksheet.addRow({
        regId: reg.registrationId, // Correct schema field is registrationId
        studentName: reg.student.fullName,
        email: reg.student.email,
        phone: reg.student.phone || '-',
        college: reg.student.college,
        course: reg.student.course || '-',
        year: reg.student.year || '-',
        sport: reg.sport.name,
        type: reg.isTeamEvent ? 'Team' : 'Individual',
        teamName: reg.teamName || '-',
        teamMembers: reg.registrationMembers.length > 0
          ? reg.registrationMembers.map(m => m.student.fullName).join(', ')
          : '-',
        paymentAmount: reg.paymentAmount || 0,
        status: reg.status.toUpperCase(),
        registeredDate: new Date(reg.registeredAt).toLocaleDateString('en-IN'), // Correct schema field is registeredAt
      })

      // Alternate row colors
      if (index % 2 === 0) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF5F5F5' },
        }
      }

      // Status color coding
      const statusCell = row.getCell('status')
      if (reg.status === 'approved') {
        statusCell.font = { color: { argb: 'FF4CAF50' }, bold: true }
      } else if (reg.status === 'rejected') {
        statusCell.font = { color: { argb: 'FFEF4444' }, bold: true }
      } else {
        statusCell.font = { color: { argb: 'FFFF9800' }, bold: true }
      }
    })

    // Add borders to all cells
    worksheet.eachRow({ includeEmpty: false }, (row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
          right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        }
      })
    })

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer()

    // Create filename with date
    const date = new Date().toISOString().split('T')[0]
    const filename = `AAGAAZ-Registrations-${date}.xlsx`

    // Return file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Excel export error:', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
