// app/dashboard/department/interns/page.tsx
'use client'
import DashboardLayout from '@/components/DashboardLayout'

export default function DepartmentInterns() {
  return (
    <DashboardLayout>
      <h1 className="text-xl font-semibold text-gray-900 mb-6">My Interns</h1>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <p className="text-sm text-gray-400 text-center py-8">
          No interns in your department yet.
        </p>
      </div>
    </DashboardLayout>
  )
}