"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuthStore()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (mounted && !isAuthenticated) {
            router.push("/login")
        }
    }, [isAuthenticated, router, mounted])

    // Prevent hydration mismatch and show loading state
    if (!mounted) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#25D366]"></div>
                    <p className="text-muted-foreground animate-pulse">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null // Will redirect due to useEffect
    }

    return <>{children}</>
}
