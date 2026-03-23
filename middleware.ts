// middleware.ts  (at root, same level as app/)
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const ROLE_MAP: Record<string, string> = {
  '/dashboard/admin':      'admin',
  '/dashboard/department': 'department',
  '/dashboard/intern':     'intern',
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const requiredRole = Object.entries(ROLE_MAP).find(
    ([prefix]) => pathname.startsWith(prefix)
  )?.[1]

  if (!requiredRole) return NextResponse.next()

  const token = req.cookies.get('auth_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)

    if (payload.role !== requiredRole) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
}