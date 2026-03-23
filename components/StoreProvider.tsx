// components/StoreProvider.tsx
'use client'
import { useEffect, useRef } from 'react'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import { restoreSession } from '@/store/slices/authSlice'

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false)
  useEffect(() => {
    if (!initialized.current) {
      store.dispatch(restoreSession())
      initialized.current = true
    }
  }, [])
  return <Provider store={store}>{children}</Provider>
}