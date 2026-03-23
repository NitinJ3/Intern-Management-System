'use server'
import { adminClient } from '@/lib/hasura/client'
import {
    CREATE_INTERN,
    CREATE_INTERN_USER,
    GET_ALL_INTERNS,
} from '@/lib/hasura/queries/interns'
import { hashPassword } from '@/lib/utils/hash'
import type { Intern, CreateInternInput } from './types'

export async function getInternsService(): Promise<Intern[]> {
    const data = await adminClient.request<{ interns: Intern[] }>(GET_ALL_INTERNS)
    return data.interns
}

export async function createInternService(
    input: CreateInternInput
): Promise<{ id: string; name: string }> {
    // Step 1 — hash password
    const hashed = await hashPassword(input.password)

    // Step 2 — create user account
    const userData = await adminClient.request<{
        insert_users_one: { id: string }
    }>(CREATE_INTERN_USER, {
        email: input.email,
        password: hashed,
        department_id: input.department_id,
    })

    const userId = userData.insert_users_one.id

    // Step 3 — create intern record
    const internData = await adminClient.request<{
        insert_interns_one: { id: string; name: string }
    }>(CREATE_INTERN, {
        user_id: userId,
        department_id: input.department_id,
        name: input.name,
        gender: input.gender || null,
        phone: input.phone || null,
        institute_id: input.institute_id || null,
        start_date: input.start_date || null,
        end_date: input.end_date || null,
        status_id: input.status_id || null,
    })

    return internData.insert_interns_one
}