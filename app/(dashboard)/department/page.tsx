// app/dashboard/department/page.tsx
'use client'
import DashboardLayout from '@/components/DashboardLayout'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'

export default function DepartmentHome() {
  const { user } = useSelector((s: RootState) => s.auth)
  return (
    <DashboardLayout>
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Department Dashboard</h1>
      <p className="text-sm text-gray-500 mb-8">{user?.email}</p>
      <div className="grid grid-cols-2 gap-4 max-w-lg">
        {[
          { label: 'My Interns',     value: '—' },
          { label: 'Active Interns', value: '—' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{card.value}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}