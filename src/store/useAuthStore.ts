import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
    id: string
    name: string
    email: string
    avatar: string
    role: 'admin' | 'agent' | 'manager'
}

interface AuthStore {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    checkAuth: () => boolean
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            login: async (email: string, password: string) => {
                // Accept any email/password combination
                const fakeToken = `fake-jwt-token-${Date.now()}`
                const fakeUser: User = {
                    id: '1',
                    name: email.split('@')[0] || 'Demo User',
                    email: email,
                    avatar: 'https://github.com/shadcn.png',
                    role: 'admin'
                }
                
                set({
                    user: fakeUser,
                    token: fakeToken,
                    isAuthenticated: true
                })
            },
            logout: () => {
                set({ 
                    user: null, 
                    token: null, 
                    isAuthenticated: false 
                })
            },
            checkAuth: () => {
                const { token } = get()
                return !!token
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
)
