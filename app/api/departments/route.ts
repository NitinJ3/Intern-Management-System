import { NextRequest, NextResponse } from 'next/server'
import {
    getDepartmentsService,
    createDepartmentService,
    createDepartmentUserService,
} from '@/modules/departments/service'

export async function GET() {
    try {
        const departments = await getDepartmentsService()
        return NextResponse.json(departments)
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { type, ...input } = body

        if (type === 'department') {
            const dept = await createDepartmentService({ name: input.name })
            return NextResponse.json(dept)
        }

        if (type === 'department_user') {
            const user = await createDepartmentUserService(input)
            return NextResponse.json(user)
        }

        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    } catch (err: any) {
        const isDuplicate = err.message?.includes('Uniqueness violation')
        return NextResponse.json(
            { error: isDuplicate ? 'Email already exists' : err.message },
            { status: isDuplicate ? 409 : 500 }
        )
    }
}