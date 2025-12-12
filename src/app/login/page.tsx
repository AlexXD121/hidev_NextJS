"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutDashboard, MessageSquare, BarChart3, Users, Zap, CheckCircle2, ArrowRight, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { cn } from "@/lib/utils"
// Turbo: Add framer-motion for animations
import { motion, AnimatePresence } from "framer-motion"

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

const registerSchema = loginSchema.extend({
    fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
})

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("signin")
    const login = useAuthStore((state) => state.login)
    const register = useAuthStore((state) => state.register)
    const router = useRouter()

    // Form for Login
    const {
        register: registerLogin,
        handleSubmit: handleSubmitLogin,
        formState: { errors: errorsLogin },
    } = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
    })

    // Form for Register
    const {
        register: registerRegister,
        handleSubmit: handleSubmitRegister,
        formState: { errors: errorsRegister },
    } = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
    })

    const onLogin = async (data: z.infer<typeof loginSchema>) => {
        setIsLoading(true)
        try {
            await login(data.email, data.password)

            toast.success("Welcome back!", {
                description: "Redirecting to your dashboard...",
                icon: <CheckCircle2 className="text-emerald-500" />,
            })

            router.push("/")
        } catch (error) {
            console.error(error)
            toast.error("Login failed", {
                description: "Please check your credentials and try again.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const onRegister = async (data: z.infer<typeof registerSchema>) => {
        setIsLoading(true)
        try {
            await register(data.fullName, data.email, data.password)

            toast.success("Account created!", {
                description: "Welcome to your new workspace.",
                icon: <CheckCircle2 className="text-emerald-500" />,
            })

            router.push("/")
        } catch (error) {
            console.error(error)
            toast.error("Registration failed", {
                description: "Something went wrong. Please try again.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="grid min-h-screen w-full lg:grid-cols-2">
            {/* Left Panel - Brand / Features */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="hidden h-full flex-col justify-between bg-[#111B21] p-10 text-white lg:flex"
            >
                <div className="flex items-center gap-2 text-lg font-medium">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
                        <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    WhatsApp Biz
                </div>

                <div className="space-y-6 max-w-md">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-4xl font-bold tracking-tight"
                    >
                        Manage your WhatsApp Empire with ease.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-gray-400 text-lg"
                    >
                        The all-in-one platform for automated messaging, customer relationships, and analytics.
                    </motion.p>

                    <div className="space-y-4 pt-4">
                        <FeatureRow icon={BarChart3} title="Advanced Analytics" description="Track delivery rates and engagement in real-time." delay={0.4} />
                        <FeatureRow icon={Users} title="CRM Integration" description="Seamlessly manage contacts and customer data." delay={0.5} />
                        <FeatureRow icon={Zap} title="Smart Bots" description="Automate responses with AI-powered chatbots." delay={0.6} />
                    </div>
                </div>

                <div className="text-sm text-gray-400">
                    &copy; 2025 WhatsApp Business Dashboard. All rights reserved.
                </div>
            </motion.div>

            {/* Right Panel - Login Form */}
            <div className="flex items-center justify-center bg-background p-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
                >
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {activeTab === "signin" ? "Welcome back" : "Create an account"}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {activeTab === "signin"
                                ? "Enter your email to sign in to your account"
                                : "Enter your email below to create your account"}
                        </p>
                    </div>

                    <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="signin">Sign In</TabsTrigger>
                            <TabsTrigger value="register">Create Account</TabsTrigger>
                        </TabsList>

                        <AnimatePresence mode="wait">
                            <TabsContent value="signin" key="signin">
                                <motion.form
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    onSubmit={handleSubmitLogin(onLogin)}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@company.com"
                                            className="focus-visible:ring-emerald-500 transition-all duration-300 hover:border-emerald-400"
                                            {...registerLogin("email")}
                                        />
                                        {errorsLogin.email && (
                                            <p className="text-sm text-red-500">{errorsLogin.email.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password">Password</Label>
                                            <a href="#" className="text-sm text-emerald-600 hover:text-emerald-500 font-medium hover:underline">
                                                Forgot password?
                                            </a>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            className="focus-visible:ring-emerald-500 transition-all duration-300 hover:border-emerald-400"
                                            {...registerLogin("password")}
                                        />
                                        {errorsLogin.password && (
                                            <p className="text-sm text-red-500">{errorsLogin.password.message}</p>
                                        )}
                                    </div>
                                    <Button
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                                        type="submit"
                                        disabled={isLoading}
                                    >
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Sign In with Email
                                    </Button>
                                </motion.form>
                            </TabsContent>

                            <TabsContent value="register" key="register">
                                <motion.form
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    onSubmit={handleSubmitRegister(onRegister)}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName">Full Name</Label>
                                        <Input
                                            id="fullName"
                                            placeholder="John Doe"
                                            className="focus-visible:ring-emerald-500 transition-all duration-300 hover:border-emerald-400"
                                            {...registerRegister("fullName")}
                                        />
                                        {errorsRegister.fullName && (
                                            <p className="text-sm text-red-500">{errorsRegister.fullName.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="register-email">Email</Label>
                                        <Input
                                            id="register-email"
                                            type="email"
                                            placeholder="name@company.com"
                                            className="focus-visible:ring-emerald-500 transition-all duration-300 hover:border-emerald-400"
                                            {...registerRegister("email")}
                                        />
                                        {errorsRegister.email && (
                                            <p className="text-sm text-red-500">{errorsRegister.email.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="register-password">Password</Label>
                                        <Input
                                            id="register-password"
                                            type="password"
                                            className="focus-visible:ring-emerald-500 transition-all duration-300 hover:border-emerald-400"
                                            {...registerRegister("password")}
                                        />
                                        {errorsRegister.password && (
                                            <p className="text-sm text-red-500">{errorsRegister.password.message}</p>
                                        )}
                                    </div>
                                    <Button
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                                        type="submit"
                                        disabled={isLoading}
                                    >
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Create Account
                                    </Button>
                                </motion.form>
                            </TabsContent>
                        </AnimatePresence>
                    </Tabs>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        By clicking continue, you agree to our{" "}
                        <a href="#" className="underline underline-offset-4 hover:text-primary">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="underline underline-offset-4 hover:text-primary">
                            Privacy Policy
                        </a>
                        .
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

function FeatureRow({ icon: Icon, title, description, delay = 0 }: { icon: any, title: string, description: string, delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="flex items-start gap-4"
        >
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                <Icon className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="text-sm text-gray-400">{description}</p>
            </div>
        </motion.div>
    )
}
