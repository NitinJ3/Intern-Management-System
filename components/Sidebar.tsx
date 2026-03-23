// components/Sidebar.tsx
'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '@/store/slices/authSlice'
import type { RootState, AppDispatch } from '@/store/store'

// Nav items per role
const NAV = {
  admin: [
    { label: 'Overview',    href: '/admin' },
    { label: 'Departments', href: '/admin/departments' },
    { label: 'Interns',     href: '/admin/interns' },
  ],
  department: [
    { label: 'Overview', href: '/department' },
    { label: 'Interns',  href: '/department/interns' },
  ],
  intern: [
    { label: 'My Profile', href: '/intern' },
  ],
}

export default function Sidebar() {
  const pathname = usePathname()
  const router   = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((s: RootState) => s.auth)

  if (!user) return null

  const links = NAV[user.role]

  const handleLogout = async () => {
    await dispatch(logoutUser())
    router.push('/login')
  }

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-200">
        <p className="font-semibold text-gray-900 text-sm">IMS</p>
        <p className="text-xs text-gray-400 mt-0.5 capitalize">{user.role}</p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {links.map((link) => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-lg text-sm transition ${
                active
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* User + logout */}
      <div className="px-4 py-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 truncate mb-2">{user.email}</p>
        <button
          onClick={handleLogout}
          className="text-xs text-red-500 hover:text-red-700 transition"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}