import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const sport = await prisma.sport.create({
      data: {
        name: body.name,
        category: body.category,
        minTeamSize: body.minTeamSize ?? null,
        maxTeamSize: body.maxTeamSize ?? null,
        registrationFee: body.registrationFee,
        description: body.description ?? null,
        rules: body.rules ?? null,
      },
    })
    return NextResponse.json({ success: true, sport })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'Sport with this name already exists' }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: 'Failed to create sport' }, { status: 500 })
  }
}
