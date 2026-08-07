// app/api/registrations/export/route.ts - FIX EXCEL EXPORT

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import ExcelJS from 'exceljs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sport = searchParams.get('sport')
    const status = searchParams.get('status')

    const registrations = await prisma.registration.findMany({
      where: {
        ...(sport && { sportId: sport }),
        ...(status && { status }),
      },
      include: {
        student: true,
        sport: true,
        registrationMembers: { include: { student: true } },
      },
      orderBy: { registeredAt: 'desc' },
    })

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Registrations')

    // Set workbook properties
    workbook.creator = 'SSC Admin'
    workbook.created = new Date()

    // Add headers with styling
    worksheet.columns = [
      { header: 'Reg ID', key: 'registrationId', width: 20 },
      { header: 'Student Name', key: 'studentName', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'College', key: 'college', width: 30 },
      { header: 'Course', key: 'course', width: 20 },
      { header: 'Year', key: 'year', width: 10 },
      { header: 'Gender', key: 'gender', width: 12 },
      { header: 'DOB', key: 'dob', width: 15 },
      { header: 'Address', key: 'address', width: 40 },
      { header: 'Sport', key: 'sport', width: 20 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Team Name', key: 'teamName', width: 25 },
      { header: 'Team Members', key: 'teamMembers', width: 50 },
      { header: 'Payment', key: 'amount', width: 12 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Registered', key: 'registeredAt', width: 20 },
    ]

    // Add data rows
    registrations.forEach((reg) => {
      const teamMembersStr = reg.registrationMembers
        .map((tm) => `${tm.student.fullName} (${tm.role || 'Player'})`)
        .join(', ')

      worksheet.addRow({
        registrationId: reg.registrationId,
        studentName: reg.student.fullName,
        email: reg.student.email,
        phone: reg.student.phone || 'N/A',
        college: reg.student.college,
        course: reg.student.course,
        year: reg.student.year,
        gender: reg.student.gender || 'N/A',
        dob: reg.student.dateOfBirth ? reg.student.dateOfBirth.toLocaleDateString('en-IN') : 'N/A',
        address: reg.student.address || 'N/A',
        sport: reg.sport.name,
        type: reg.isTeamEvent ? 'Team' : 'Individual',
        teamName: reg.teamName || 'N/A',
        teamMembers: teamMembersStr || 'N/A',
        amount: `₹${reg.paymentAmount}`,
        status: reg.status.toUpperCase(),
        registeredAt: reg.registeredAt.toLocaleDateString('en-IN'),
      })
    })

    // Style header row
    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 }
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4CAF50' },
    }
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
    headerRow.height = 25

    // Style data rows
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.alignment = { vertical: 'middle', wrapText: true }
        row.height = 20
        
        // Alternate row colors
        if (rowNumber % 2 === 0) {
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF5F5F5' },
          }
        }
      }
    })

    // Add borders to all cells
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
          left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
          bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
          right: { style: 'thin', color: { argb: 'FFD0D0D0' } },
        }
      })
    })

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer()

    // Create proper filename
    const sportName = sport ? `-${registrations[0]?.sport.name.replace(/\s+/g, '-')}` : ''
    const statusName = status ? `-${status}` : ''
    const timestamp = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    const filename = `AAGAAZ-Registrations${sportName}${statusName}-${timestamp}.xlsx`

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Excel export error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate Excel file' },
      { status: 500 }
    )
  }
}
