export interface Department {
    id: string
    name: string
    created_at: string
}

export interface CreateDepartmentInput {
    name: string
}

export interface CreateDepartmentUserInput {
    email: string
    password: string
    department_id: string
}