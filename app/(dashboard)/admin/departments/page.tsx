'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { createDepartment, createDepartmentUser } from '@/lib/actions'
import { adminClient } from '@/lib/hasura'
import { GET_DEPARTMENTS } from '@/lib/mutations'
import {
  PlusCircle,
  Users,
  Building2,
  Mail,
  Lock,
  Hash,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Search,
  ChevronDown
} from 'lucide-react'

interface Department {
  id: string
  name: string
}

export default function AdminDepartments() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form States
  const [deptName, setDeptName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [selectedDept, setSelectedDept] = useState('')

  useEffect(() => { fetchDepartments() }, [])

  const fetchDepartments = async () => {
    try {
      const res = await fetch('/api/departments')
      const data = await res.json()
      setDepartments(data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreateDept = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess('')
    const result = await createDepartment(deptName)
    if (result.success) {
      setSuccess(`Department "${deptName}" created!`)
      setDeptName(''); fetchDepartments()
    } else {
      setError(result.error || 'Failed to create department')
    }
    setLoading(false)
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDept) { setError('Please select a department'); return }
    setLoading(true); setError(''); setSuccess('')
    const result = await createDepartmentUser(userEmail, userPassword, selectedDept)
    if (result.success) {
      setSuccess(`User access granted for ${userEmail}`)
      setUserEmail(''); setUserPassword(''); setSelectedDept('')
    } else {
      setError(result.error || 'Failed to create user')
    }
    setLoading(false)
  }

  // REFINED STYLES FOR VISIBILITY
  const inputStyle = `
    w-full pl-11 pr-4 py-3 
    bg-slate-50 border border-slate-200 rounded-2xl 
    text-slate-900 font-medium
    placeholder:text-slate-500 placeholder:opacity-100
    transition-all duration-300 outline-none
    focus:bg-white focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-500
  `

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Department Management</h1>
            <p className="text-slate-500 text-sm font-medium">Create organization units and manage portal access.</p>
          </div>
        </div>

        {/* Floating Notifications */}
        <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm">
          {error && (
            <div className="flex items-center gap-3 bg-red-600 text-white p-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-full">
              <AlertCircle size={20} />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-3 bg-emerald-600 text-white p-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-full">
              <CheckCircle2 size={20} />
              <p className="text-sm font-bold">{success}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Create Department Card */}
          <section className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <Building2 size={22} />
              </div>
              <h2 className="font-bold text-slate-800">New Department</h2>
            </div>

            <form onSubmit={handleCreateDept} className="space-y-4">
              <div className="relative group">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  type="text" required value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  placeholder="Department Name (e.g. Engineering)"
                  className={inputStyle}
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <PlusCircle size={18} />}
                Create Department
              </button>
            </form>
          </section>

          {/* Create User Card */}
          <section className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <Users size={22} />
              </div>
              <h2 className="font-bold text-slate-800">Department Credentials</h2>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="relative group">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 z-10" size={18} />
                <select
                  required value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className={`${inputStyle} appearance-none cursor-pointer text-slate-700`}
                >
                  <option value="" className="text-slate-400">Assign to Department</option>
                  {departments.map((d) => <option key={d.id} value={d.id} className="text-slate-900">{d.name}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              </div>

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500" size={18} />
                <input
                  type="email" required value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Department Email"
                  className={inputStyle}
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500" size={18} />
                <input
                  type="password" required value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  placeholder="Access Password"
                  className={inputStyle}
                />
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                Generate Login Access
              </button>
            </form>
          </section>
        </div>

        {/* Data Table */}
        <section className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
          <div className="px-8 py-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="font-bold text-slate-900">Active Departments ({departments.length})</h2>
            <div className="relative w-full md:w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
              <input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all" />
            </div>
          </div>

          <div className="overflow-x-auto">
            {departments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-40">
                <Building2 size={48} className="mb-4 text-slate-300" />
                <p className="text-sm font-medium">No departments registered yet.</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Department Name</th>
                    <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">System ID</th>
                    <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {departments.map((dept) => (
                    <tr key={dept.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                            {dept.name.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="font-bold text-slate-700">{dept.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                          <Hash size={12} />
                          {dept.id}
                        </div>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <button className="text-indigo-600 text-xs font-bold hover:underline">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}