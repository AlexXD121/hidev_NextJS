import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '@/lib/api'

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
                    const { user, token } = await api.auth.login(email, password);
                    set({
                        user,
                        token,
                        isAuthenticated: true,
                        isLoading: false
                    })
                } catch (error) {
                    console.error("Login error:", error);
                    set({ error: 'Login failed', isLoading: false })
                    throw error
                }
            },

            register: async (name: string, email: string, password: string) => {
                set({ isLoading: true, error: null })
                try {
                    // Call Real API
                    const { user, token } = await api.auth.register(name, email, password);

                    set({
                        user,
                        token,
                        isAuthenticated: true,
                        isLoading: false
                    })
                } catch (error) {
                    console.error("Registration error:", error);
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
