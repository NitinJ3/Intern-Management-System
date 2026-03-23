'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Department } from './types'

export function useDepartments() {
    const [departments, setDepartments] = useState<Department[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetch = useCallback(async () => {
        setLoading(true)
        try {
            const res = await window.fetch('/api/departments')
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            setDepartments(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetch() }, [fetch])

    return { departments, loading, error, refetch: fetch }
}