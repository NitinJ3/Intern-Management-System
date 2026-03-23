// app/dashboard/intern/page.tsx
'use client'
import DashboardLayout from '@/components/DashboardLayout'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'

export default function InternHome() {
  const { user } = useSelector((s: RootState) => s.auth)
  return (
    <DashboardLayout>
      <h1 className="text-xl font-semibold text-gray-900 mb-1">My Profile</h1>
      <p className="text-sm text-gray-500 mb-8">{user?.email}</p>
      <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-md">
        <p className="text-sm text-gray-400">Your internship details will appear here.</p>
      </div>
    </DashboardLayout>
  )
}