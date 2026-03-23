'use server'
import { adminClient } from '@/lib/hasura/client'
import {
    CREATE_DEPARTMENT,
    CREATE_DEPARTMENT_USER,
    GET_DEPARTMENTS,
} from '@/lib/hasura/queries/departments'
import { hashPassword } from '@/lib/utils/hash'
import type {
    Department,
    CreateDepartmentInput,
    CreateDepartmentUserInput,
} from './types'

export async function getDepartmentsService(): Promise<Department[]> {
    const data = await adminClient.request<{ departments: Department[] }>(
        GET_DEPARTMENTS
    )
    return data.departments
}

export async function createDepartmentService(
    input: CreateDepartmentInput
): Promise<Department> {
    const data = await adminClient.request<{
        insert_departments_one: Department
    }>(CREATE_DEPARTMENT, { name: input.name })

    return data.insert_departments_one
}

export async function createDepartmentUserService(
    input: CreateDepartmentUserInput
): Promise<{ id: string; email: string }> {
    const hashed = await hashPassword(input.password)

    const data = await adminClient.request<{
        insert_users_one: { id: string; email: string }
    }>(CREATE_DEPARTMENT_USER, {
        email: input.email,
        password: hashed,
        department_id: input.department_id,
    })

    return data.insert_users_one
}