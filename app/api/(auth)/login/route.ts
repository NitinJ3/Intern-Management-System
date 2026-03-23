import { NextRequest, NextResponse } from 'next/server'
import { loginService } from '@/modules/auth/service'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const result = await loginService({ email, password })

    const response = NextResponse.json(result)
    response.cookies.set('auth_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8,
      path: '/',
    })

    return response
  } catch (err: any) {
    const isAuthError = err.message === 'Invalid email or password'
    return NextResponse.json(
      { error: err.message },
      { status: isAuthError ? 401 : 500 }
    )
  }
}