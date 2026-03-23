// components/LoginForm.tsx
'use client'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, ChevronRight } from 'lucide-react'
import { loginUser, clearError } from '@/store/slices/authSlice'
import type { AppDispatch, RootState } from '@/store/store'

export default function LoginForm() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { status, error, user } = useSelector((s: RootState) => s.auth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  // Redirect Logic
  useEffect(() => {
    if (user) {
      const paths = { admin: '/admin', department: '/department', intern: '/intern' }
      router.replace(paths[user.role as keyof typeof paths])
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(loginUser({ email, password }))
  }

  // Shared Tailwind Classes for consistency
  const inputBase = `
    w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 
    placeholder:text-slate-400 transition-all duration-300
    focus:bg-white focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-500 focus:outline-none
  `

  return (
    <div className="w-full">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Sign In
        </h1>
        <p className="text-slate-500 font-medium">
          IMS <span className="text-slate-300 mx-1">|</span> Portal Access
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 p-4 rounded-2xl animate-in fade-in zoom-in-95 duration-300">
            <AlertCircle size={20} className="shrink-0 text-red-500" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                if (error) dispatch(clearError())
                setEmail(e.target.value)
              }}
              placeholder="name@company.com"
              className={inputBase}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-sm font-bold text-slate-700">Password</label>
            <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
              Forgot?
            </button>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input
              type={showPass ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => {
                if (error) dispatch(clearError())
                setPassword(e.target.value)
              }}
              placeholder="••••••••"
              className={inputBase}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="group relative w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl 
                   shadow-lg shadow-indigo-200 transition-all duration-300 active:scale-[0.98]
                   disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
        >
          <div className="relative z-10 flex items-center justify-center gap-2">
            {status === 'loading' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Sign into Dashboard</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </div>
        </button>

        {/* Demo Hint */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold text-center mb-1">
              Test Credentials
            </p>
            <p className="text-xs text-center text-slate-600 font-mono">
              admin@intern.com <span className="text-slate-300 px-1">/</span> Admin@123
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}