"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Lock, ArrowRight, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const login = useAuthStore((state) => state.login)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500))

            // Accept any email/password combination
            await login(email, password)
            
            toast.success("Welcome back!", {
                description: "Redirecting to your dashboard...",
                icon: <CheckCircle2 className="text-green-500" />
            })
            
            router.push("/")
        } catch (error) {
            toast.error("Login failed", {
                description: "Please try again"
            })
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-950 p-4 overflow-hidden relative">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-green-400/20 to-transparent rounded-full blur-3xl opacity-50"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [180, 0, 180],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-emerald-600/20 to-transparent rounded-full blur-3xl opacity-50"
                />
            </div>

            <Card className="w-full max-w-md relative z-10 border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                <CardHeader className="space-y-1 text-center pb-8">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="flex justify-center mb-6"
                    >
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center shadow-lg transform rotate-3">
                            <MessageSquare className="h-8 w-8 text-white fill-current" />
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                            WhatsApp Biz
                        </CardTitle>
                        <CardDescription className="text-base mt-2">
                            Sign in to manage your campaigns
                        </CardDescription>
                    </motion.div>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-2"
                        >
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-11 bg-white/50 dark:bg-slate-950/50 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-[#25D366] transition-all"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-2"
                        >
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <span className="text-xs text-muted-foreground">Admin access only</span>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-11 pl-4 pr-10 bg-white/50 dark:bg-slate-950/50 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-[#25D366] transition-all"
                                />
                                <Lock className="absolute right-3 top-3.5 h-4 w-4 text-muted-foreground" />
                            </div>
                        </motion.div>
                    </CardContent>
                    <CardFooter className="pt-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="w-full"
                        >
                            <Button
                                className="w-full h-11 text-base font-medium bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20bd5a] hover:to-[#0e6f63] transition-all duration-300 shadow-lg hover:shadow-xl"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Signing in...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span>Sign In</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                )}
                            </Button>
                        </motion.div>
                    </CardFooter>
                </form>
            </Card>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 2 }}
                className="absolute bottom-6 text-xs text-muted-foreground text-center w-full"
            >
                &copy; 2024 WhatsApp Business Dashboard
            </motion.div>
        </div>
    )
}
