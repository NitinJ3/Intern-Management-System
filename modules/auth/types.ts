export type UserRole = 'admin' | 'department' | 'intern'

export interface AuthUser {
    id: string
    email: string
    role: UserRole
    department_id: string | null
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface AuthResponse {
    token: string
    user: AuthUser
}