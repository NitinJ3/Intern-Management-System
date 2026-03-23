// app/login/page.tsx
import LoginForm from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#fdfeff] relative overflow-hidden px-4">
      {/* Soft Decorative Blobs for depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[120px] z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] z-0" />

      <div className="z-10 w-full max-w-[420px]">
        {/* The Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-[2rem] shadow-2xl shadow-indigo-100/50 p-8 md:p-12">
          <LoginForm />
        </div>
        
        <footer className="mt-8 text-center">
          <p className="text-slate-400 text-sm font-medium">
            Protected by <span className="text-slate-600">Enterprise Security</span>
          </p>
        </footer>
      </div>
    </main>
  )
}