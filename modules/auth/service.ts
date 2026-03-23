import jwt from 'jsonwebtoken'
import { adminClient } from '@/lib/hasura/client'
import { GET_USER_BY_EMAIL } from '@/lib/hasura/queries/misc'
import { comparePassword } from '@/lib/utils/hash'
import type { AuthUser, LoginCredentials, AuthResponse } from './types'

interface HasuraUser {
    id: string
    email: string
    password: string
    role: 'admin' | 'department' | 'intern'
    department_id: string | null
}

export async function loginService(
    credentials: LoginCredentials
): Promise<AuthResponse> {
    const { email, password } = credentials

    // 1. Fetch user
    const data = await adminClient.request<{ users: HasuraUser[] }>(
        GET_USER_BY_EMAIL,
        { email }
    )

    const user = data.users[0]

    // 2. Validate — same error for both cases (prevents email enumeration)
    if (!user) {
        throw new Error('Invalid email or password')
    }

    const passwordMatch = await comparePassword(password, user.password)
    if (!passwordMatch) {
        throw new Error('Invalid email or password')
    }

    // 3. Sign JWT with Hasura claims
    const token = jwt.sign(
        {
            sub: user.id,
            email: user.email,
            role: user.role,
            'https://hasura.io/jwt/claims': {
                'x-hasura-allowed-roles': [user.role],
                'x-hasura-default-role': user.role,
                'x-hasura-user-id': user.id,
                'x-hasura-department-id': user.department_id ?? '',
            },
        },
        process.env.JWT_SECRET!,
        { expiresIn: '8h' }
    )

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            department_id: user.department_id,
        },
    }
}