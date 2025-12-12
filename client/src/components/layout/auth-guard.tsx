"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuthStore()
    const router = useRouter()
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        // Prevent infinite redirect loop if already on login
        if (!isAuthenticated && !isLoading && pathname !== "/login") {
            router.push("/login")
        }
    }, [isAuthenticated, isLoading, router, mounted, pathname])

    // Specific check to allow rendering if authenticated or if strictly loading
    if (!mounted || isLoading) {
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
        return null // Will redirect via useEffect
    }

    return <>{children}</>
}
