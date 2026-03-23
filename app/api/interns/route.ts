import { NextRequest, NextResponse } from 'next/server'
import { getInternsService, createInternService } from '@/modules/interns/service'

export async function GET() {
  try {
    const interns = await getInternsService()
    return NextResponse.json(interns)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const intern = await createInternService(body)
    return NextResponse.json(intern)
  } catch (err: any) {
    const isDuplicate = err.message?.includes('Uniqueness violation')
    return NextResponse.json(
      { error: isDuplicate ? 'Email already exists' : err.message },
      { status: isDuplicate ? 409 : 500 }
    )
  }
}