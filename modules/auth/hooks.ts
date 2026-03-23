'use client'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { loginUser, logoutUser } from '@/store/slices/authSlice'
import type { RootState, AppDispatch } from '@/store/store'
import type { UserRole } from './types'

export const ROLE_REDIRECT: Record<UserRole, string> = {
    admin: '/dashboard/admin',
    department: '/dashboard/department',
    intern: '/dashboard/intern',
}

export function useAuth() {
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()
    const { user, token, status, error } = useSelector((s: RootState) => s.auth)

    const login = async (email: string, password: string) => {
        const result = await dispatch(loginUser({ email, password }))
        if (loginUser.fulfilled.match(result)) {
            router.replace(ROLE_REDIRECT[result.payload.user.role])
        }
    }

    const logout = async () => {
        await dispatch(logoutUser())
        router.push('/login')
    }

    return { user, token, status, error, login, logout }
}