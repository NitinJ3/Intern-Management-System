// app/dashboard/admin/interns/page.tsx
'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { createIntern } from '@/lib/actions'
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Building2, 
  School, 
  Calendar, 
  Activity, 
  Loader2, 
  Search, 
  ChevronDown, 
  X,
  Plus,
  AlertCircle,
  CheckCircle2,
  Users
} from 'lucide-react'

interface Department { id: string; name: string }
interface Institute { id: string; name: string }
interface Status { id: string; status: string }
interface Intern {
  id: string; name: string; gender: string; phone: string
  user: { email: string }
  department: { name: string }
}

export default function AdminInterns() {
  const [interns, setInterns] = useState<Intern[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [institutes, setInstitutes] = useState<Institute[]>([])
  const [statuses, setStatuses] = useState<Status[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState({
    email: '', password: '', name: '', gender: '',
    phone: '', department_id: '', institute_id: '',
    start_date: '', end_date: '', status_id: '',
  })

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [internsRes, deptsRes, miscRes] = await Promise.all([
        fetch('/api/interns'),
        fetch('/api/departments'),
        fetch('/api/misc'),
      ])
      const [internsData, deptsData, miscData] = await Promise.all([
        internsRes.json(),
        deptsRes.json(),
        miscRes.json(),
      ])
      setInterns(internsData)
      setDepartments(deptsData)
      setInstitutes(miscData.institutes)
      setStatuses(miscData.statuses)
    } catch (err) { console.error(err) }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess('')
    const result = await createIntern(form)
    if (result.success) {
      setSuccess(`Intern "${form.name}" onboarded successfully!`)
      setForm({
        email: '', password: '', name: '', gender: '',
        phone: '', department_id: '', institute_id: '',
        start_date: '', end_date: '', status_id: '',
      })
      setShowForm(false)
      fetchAll()
    } else {
      setError(result.error || 'Failed to create intern')
    }
    setLoading(false)
  }

  // REFINED UI CONSTANTS
  const inputContainer = "flex flex-col gap-1.5"
  const labelStyle = "text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider"
  const inputStyle = `
    w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm 
    text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-4 
    focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none
  `
  const selectStyle = `${inputStyle} appearance-none cursor-pointer`

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-10">
        
        {/* Header Section */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Intern Directory</h1>
            <p className="text-slate-500 text-sm">Manage student onboardings and internship records.</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg ${
              showForm 
              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-slate-100' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
            }`}
          >
            {showForm ? <X size={18} /> : <Plus size={18} />}
            {showForm ? 'Close Form' : 'Add New Intern'}
          </button>
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

        {/* CREATE INTERN FORM */}
        {showForm && (
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <UserPlus size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Intern Onboarding</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Section 1: Account Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">1. Account Credentials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={inputContainer}>
                    <label className={labelStyle}>Login Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="intern@company.com" className={inputStyle} />
                    </div>
                  </div>
                  <div className={inputContainer}>
                    <label className={labelStyle}>Temporary Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input name="password" type="password" required value={form.password} onChange={handleChange} placeholder="••••••••" className={inputStyle} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Personal details */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">2. Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={inputContainer}>
                    <label className={labelStyle}>Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input name="name" type="text" required value={form.name} onChange={handleChange} placeholder="John Doe" className={inputStyle} />
                    </div>
                  </div>
                  <div className={inputContainer}>
                    <label className={labelStyle}>Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input name="phone" type="text" value={form.phone} onChange={handleChange} placeholder="+91..." className={inputStyle} />
                    </div>
                  </div>
                  <div className={inputContainer}>
                    <label className={labelStyle}>Gender</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={16} />
                      <select name="gender" value={form.gender} onChange={handleChange} className={selectStyle}>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Internship details */}
              <div className="space-y-4 pt-4 border-t border-slate-50">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">3. Placement Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={inputContainer}>
                    <label className={labelStyle}>Department</label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={16} />
                      <select name="department_id" required value={form.department_id} onChange={handleChange} className={selectStyle}>
                        <option value="">Select Dept</option>
                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                  <div className={inputContainer}>
                    <label className={labelStyle}>Institute</label>
                    <div className="relative">
                      <School className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={16} />
                      <select name="institute_id" value={form.institute_id} onChange={handleChange} className={selectStyle}>
                        <option value="">Select Institute</option>
                        {institutes.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                  <div className={inputContainer}>
                    <label className={labelStyle}>Internship Status</label>
                    <div className="relative">
                      <Activity className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={16} />
                      <select name="status_id" value={form.status_id} onChange={handleChange} className={selectStyle}>
                        <option value="">Select Status</option>
                        {statuses.map(s => <option key={s.id} value={s.id}>{s.status}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                  <div className={inputContainer}>
                    <label className={labelStyle}>Start Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input name="start_date" type="date" value={form.start_date} onChange={handleChange} className={inputStyle} />
                    </div>
                  </div>
                  <div className={inputContainer}>
                    <label className={labelStyle}>Expected End Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input name="end_date" type="date" value={form.end_date} onChange={handleChange} className={inputStyle} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="submit" disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-10 py-3.5 rounded-2xl transition-all active:scale-95 flex items-center gap-2 shadow-xl shadow-indigo-100 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                  Complete Registration
                </button>
              </div>
            </form>
          </div>
        )}

        {/* INTERNS TABLE */}
        <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
          <div className="px-8 py-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="font-bold text-slate-900">Registered Interns ({interns.length})</h2>
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" size={16} />
              <input type="text" placeholder="Search by name, email or department..." className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all" />
            </div>
          </div>

          <div className="overflow-x-auto">
            {interns.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 opacity-30">
                <Users size={64} className="mb-4 text-slate-300" />
                <p className="font-bold">No interns found in the system</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                    <th className="px-8 py-4">Intern Name</th>
                    <th className="px-8 py-4">Department</th>
                    <th className="px-8 py-4">Gender</th>
                    <th className="px-8 py-4">Contact</th>
                    <th className="px-8 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {interns.map((intern) => (
                    <tr key={intern.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                            {intern.name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800">{intern.name}</span>
                            <span className="text-[11px] text-slate-400 font-medium">{intern.user?.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 text-indigo-600">
                          {intern.department?.name}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <span className="text-xs font-bold text-slate-500 capitalize">{intern.gender || '—'}</span>
                      </td>
                      <td className="px-8 py-4">
                        <span className="text-xs font-mono text-slate-400 tracking-tight">{intern.phone || '—'}</span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <button className="text-slate-300 hover:text-indigo-600 transition-colors font-bold text-xs">Manage</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}