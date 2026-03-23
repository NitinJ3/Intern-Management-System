// app/unauthorized/page.tsx
import Link from 'next/link'
export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-sm text-gray-500 mb-4">You don't have permission to view this page.</p>
        <Link href="/login" className="text-sm text-blue-600 hover:underline">Back to login</Link>
      </div>
    </main>
  )
}