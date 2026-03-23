import { NextResponse } from 'next/server'
import { adminClient } from '@/lib/hasura/client'
import { GET_INSTITUTES, GET_STATUSES } from '@/lib/hasura/queries/misc'

export async function GET() {
    try {
        const [inst, stat] = await Promise.all([
            adminClient.request<{ institutes: any[] }>(GET_INSTITUTES),
            adminClient.request<{ internship_status: any[] }>(GET_STATUSES),
        ])
        return NextResponse.json({
            institutes: inst.institutes,
            statuses: stat.internship_status,
        })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}