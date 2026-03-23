// lib/actions.ts
'use server'
import bcrypt from 'bcryptjs'
import { adminClient } from '@/lib/hasura'
import {
  CREATE_DEPARTMENT,
  CREATE_DEPARTMENT_USER,
  CREATE_INTERN_USER,
  CREATE_INTERN,
} from '@/lib/mutations'

// ── Create Department ─────────────────────────────────────────────
export async function createDepartment(name: string) {
  try {
    const data = await adminClient.request<{
      insert_departments_one: { id: string; name: string }
    }>(CREATE_DEPARTMENT, { name })
    return { success: true, department: data.insert_departments_one }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// ── Create Department User ────────────────────────────────────────
export async function createDepartmentUser(
  email: string,
  password: string,
  department_id: string
) {
  try {
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 12)

    const data = await adminClient.request<{
      insert_users_one: { id: string; email: string }
    }>(CREATE_DEPARTMENT_USER, {
      email,
      password: hashedPassword,
      department_id,
    })
    return { success: true, user: data.insert_users_one }
  } catch (err: any) {
    // Catch duplicate email error
    if (err.message.includes('Uniqueness violation')) {
      return { success: false, error: 'Email already exists' }
    }
    return { success: false, error: err.message }
  }
}

// ── Create Intern ─────────────────────────────────────────────────
export async function createIntern(formData: {
  email: string
  password: string
  name: string
  gender: string
  phone: string
  department_id: string
  institute_id?: string
  start_date?: string
  end_date?: string
  status_id?: string
}) {
  try {
    // Step 1: Hash password
    const hashedPassword = await bcrypt.hash(formData.password, 12)

    // Step 2: Create user account
    const userData = await adminClient.request<{
      insert_users_one: { id: string }
    }>(CREATE_INTERN_USER, {
      email: formData.email,
      password: hashedPassword,
      department_id: formData.department_id,
    })

    const userId = userData.insert_users_one.id

    // Step 3: Create intern record linked to user
    const internData = await adminClient.request<{
      insert_interns_one: { id: string; name: string }
    }>(CREATE_INTERN, {
      user_id: userId,
      department_id: formData.department_id,
      name: formData.name,
      gender: formData.gender || null,
      phone: formData.phone || null,
      institute_id: formData.institute_id || null,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      status_id: formData.status_id || null,
    })

    return { success: true, intern: internData.insert_interns_one }
  } catch (err: any) {
    if (err.message.includes('Uniqueness violation')) {
      return { success: false, error: 'Email already exists' }
    }
    return { success: false, error: err.message }
  }
}