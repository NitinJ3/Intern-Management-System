'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Intern } from './types'

export function useInterns() {
    const [interns, setInterns] = useState<Intern[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetch = useCallback(async () => {
        setLoading(true)
        try {
            const res = await window.fetch('/api/interns')
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            setInterns(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetch() }, [fetch])

    return { interns, loading, error, refetch: fetch }
}