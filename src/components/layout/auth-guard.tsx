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
        if (!isAuthenticated) {
            router.push("/login")
        }
    }, [isAuthenticated, router])

    if (!mounted) {
        return null // or a loading spinner
    }

    if (!isAuthenticated) {
        return null
    }

    return <>{children}</>
}
