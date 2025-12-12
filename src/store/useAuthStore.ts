import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
    id: string
    name: string
    email: string
    avatar: string
}

interface AuthStore {
    user: User | null
    isAuthenticated: boolean
    login: (email: string) => void
    logout: () => void
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            login: async (email: string) => {
                // In a real app, this would be an async call
                // const { user, token } = await api.auth.login(email);
                set({
                    isAuthenticated: true,
                    user: {
                        id: '1',
                        name: 'Demo User',
                        email: email,
                        avatar: 'https://github.com/shadcn.png',
                    },
                });
            },
            logout: () => set({ isAuthenticated: false, user: null }),
        }),
        {
            name: 'auth-storage',
        }
    )
)
