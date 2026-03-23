export interface Intern {
    id: string
    name: string
    gender: string | null
    phone: string | null
    start_date: string | null
    end_date: string | null
    user: { email: string }
    department: { name: string }
    institute: { name: string } | null
    internship_status: { status: string } | null
}

export interface CreateInternInput {
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
}