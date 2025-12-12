"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, checkAuth } = useAuthStore()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        if (!checkAuth()) {
            router.push("/login")
        }
    }, [checkAuth, router])

    useEffect(() => {
        if (mounted && !isAuthenticated) {
            router.push("/login")
        }
    }, [isAuthenticated, router, mounted])

    if (!mounted) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    return <>{children}</>
}
