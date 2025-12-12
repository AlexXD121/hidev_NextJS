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
    isLoading: boolean
    error: string | null
    login: (email: string, password: string) => Promise<void>
    register: (name: string, email: string, password: string) => Promise<void>
    logout: () => void
    checkAuth: () => boolean
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null })
                try {
                    // Simulate network delay
                    await new Promise(resolve => setTimeout(resolve, 1500))

                    // MOCK LOGIC: Accept any valid email/password
                    // In a real app, this would be an API call
                    const fakeToken = `fake-jwt-token-${Date.now()}`
                    const fakeUser: User = {
                        id: Math.random().toString(36).substring(7),
                        name: email.split('@')[0] || 'Demo User',
                        email: email,
                        avatar: 'https://github.com/shadcn.png',
                        role: 'admin'
                    }

                    set({
                        user: fakeUser,
                        token: fakeToken,
                        isAuthenticated: true,
                        isLoading: false
                    })
                } catch (error) {
                    set({ error: 'Login failed', isLoading: false })
                    throw error
                }
            },

            register: async (name: string, email: string, password: string) => {
                set({ isLoading: true, error: null })
                try {
                    // Simulate network delay
                    await new Promise(resolve => setTimeout(resolve, 1500))

                    const fakeToken = `fake-jwt-token-${Date.now()}`
                    const fakeUser: User = {
                        id: Math.random().toString(36).substring(7),
                        name: name,
                        email: email,
                        avatar: 'https://github.com/shadcn.png',
                        role: 'admin'
                    }

                    set({
                        user: fakeUser,
                        token: fakeToken,
                        isAuthenticated: true,
                        isLoading: false
                    })
                } catch (error) {
                    set({ error: 'Registration failed', isLoading: false })
                    throw error
                }
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    error: null
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
