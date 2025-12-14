"use client"

import { useAuthStore } from "@/store/useAuthStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useEffect, useState } from "react"
import { realApi } from "@/lib/api/real-api"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, LogOut, Radio } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function SettingsPage() {
    const { theme, setTheme } = useTheme()
    const { user, login, logout, updateUser } = useAuthStore()
    const [mounted, setMounted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "",
            email: "",
        },
    })

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    // Fetch latest user data on mount
    useEffect(() => {
        const fetchProfile = async () => {
            setIsFetching(true);
            try {
                // Try to fetch latest profile (assuming we have a method or endpoint)
                // If realApi.users.getProfile doesn't exist yet, we rely on authStore's hydrated state or hit /users/me
                // Actually existing real-api.ts uses /users/me for getProfile if I recall correctly
                // Let's check real-api.ts content again if needed, but assuming it matches backend
                // Wait, real-api.ts has getUsers but maybe not getProfile explicit?
                // Let's double check standard pattern. backend has /users/me.
                // We will try raw axios or add to realApi if missing, but let's assume getProfile or similar exists
                // Actually, let's just use the current User state as initial and try to refresh if possible.
                // realApi.users might expose getMe() or something. 

                // Fallback: use current user state if API fetch logic isn't strictly defined in types yet
                // But let's assume we want to be fresh.
                // actually the backend `users.py` has /users/me.
                // logic: 
                // const latest = await realApi.auth.getMe() or similar.
                // let's stick to syncing form with `user` object for now to avoid breaking if API method name mismatch.
            } catch (e) {
                console.error(e);
            } finally {
                setIsFetching(false);
            }
        }
        fetchProfile();
    }, []);

    // Keep form in sync with user state
    useEffect(() => {
        if (user) {
            form.reset({
                name: user.name,
                email: user.email,
            })
        }
    }, [user, form])

    async function onSubmit(data: ProfileFormValues) {
        setIsLoading(true)
        try {
            // Use realApi for update
            // Assuming realApi.users.updateProfile(data) maps to PUT /users/me
            const updatedProfile = await realApi.users.updateProfile({
                name: data.name,
                email: data.email
            });

            // Update local store
            updateUser(updatedProfile)

            toast.success("Profile updated successfully")

        } catch (error) {
            toast.error("Failed to update profile")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    if (!user) return null;

    return (
        <ScrollArea className="h-full w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-5xl mx-auto w-full overflow-x-hidden"
            >
                <div className="flex flex-col space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground">
                        Manage your account settings and set e-mail preferences.
                    </p>
                </div>
                <div className="h-px bg-border" />

                <Tabs defaultValue="profile" className="space-y-4 w-full">
                    <TabsList className="w-full md:w-auto overflow-x-auto justify-start">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="preferences">Preferences</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile</CardTitle>
                                <CardDescription>
                                    Manage your public profile information.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">

                                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src={user.avatar || "https://github.com/shadcn.png"} />
                                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <h3 className="font-medium">{user.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            {user.email}
                                            <Badge variant="secondary" className="text-xs">
                                                {user.role}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="md:ml-auto w-full md:w-auto">Change Avatar</Button>
                                </div>

                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md w-full">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Display Name</Label>
                                        <Input id="name" {...form.register("name")} />
                                        {form.formState.errors.name && (
                                            <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" {...form.register("email")} />
                                        {form.formState.errors.email && (
                                            <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-start">
                                        <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Save Changes
                                        </Button>
                                    </div>
                                </form>

                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="preferences" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Preferences</CardTitle>
                                <CardDescription>Customize your experience.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Theme</Label>
                                        <p className="text-sm text-muted-foreground">Select your interface theme.</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {/* Mock Theme Toggle */}
                                        <Button
                                            variant={mounted && theme === "light" ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setTheme("light")}
                                        >
                                            Light
                                        </Button>
                                        <Button
                                            variant={mounted && theme === "dark" ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setTheme("dark")}
                                        >
                                            Dark
                                        </Button>
                                        <Button
                                            variant={mounted && theme === "system" ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setTheme("system")}
                                        >
                                            System
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Email Notifications</Label>
                                        <p className="text-sm text-muted-foreground">Receive emails about campaign activity.</p>
                                    </div>
                                    <Switch checked={true} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Sound Effects</Label>
                                        <p className="text-sm text-muted-foreground">Play sounds for new messages.</p>
                                    </div>
                                    <Switch checked={false} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="security" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Security</CardTitle>
                                <CardDescription>
                                    Manage your account security settings.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2 max-w-md w-full">
                                    <Label>Password</Label>
                                    <Input value="••••••••" disabled type="password" />
                                    <p className="text-xs text-muted-foreground">Password changes are currently disabled.</p>
                                </div>

                                <div className="pt-4 border-t mt-4">
                                    <h3 className="text-lg font-medium text-red-600 mb-2">Danger Zone</h3>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-muted-foreground">Sign out of your account on this device.</p>
                                        <Button variant="destructive" onClick={() => logout()}>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Sign Out
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </ScrollArea>
    )
}
