"use client"

import { useState } from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { User, Bell, Shield, Moon, Sun, Smartphone, Laptop } from "lucide-react"

export default function SettingsPage() {
    const { user, login } = useAuthStore() // In a real app we'd have an updateProfile method

    // Mock state for form
    const [name, setName] = useState(user?.name || "")
    const [email, setEmail] = useState(user?.email || "")
    const [isLoading, setIsLoading] = useState(false)

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Mock update - in reality we would call a store action
        // For now just show success since we can't easily mutate the immutable mock user without a proper action
        toast.success("Profile updated", {
            description: "Your changes have been saved successfully."
        })
        setIsLoading(false)
    }

    return (
        <div className="space-y-6 p-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4 lg:col-span-5 border-none shadow-none bg-transparent p-0">
                            <CardHeader className="px-0 pt-0">
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>
                                    Update your account's profile information and email address.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 px-0">
                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <div className="flex items-center gap-6 pb-6">
                                        <Avatar className="h-24 w-24">
                                            <AvatarImage src={user?.avatar} />
                                            <AvatarFallback><User /></AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1">
                                            <Button variant="outline" size="sm" type="button">Change Avatar</Button>
                                            <p className="text-xs text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Display Name</Label>
                                        <Input
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Role</Label>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground border p-2 rounded-md bg-muted/50 w-fit">
                                            <Shield className="h-4 w-4" />
                                            <span className="capitalize">{user?.role || 'User'}</span>
                                            <Badge variant="secondary" className="text-xs">Read-only</Badge>
                                        </div>
                                        <p className="text-[0.8rem] text-muted-foreground">Contact your administrator to change your role.</p>
                                    </div>

                                    <div className="pt-4">
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="preferences">
                    <div className="grid gap-4">
                        <AppearanceCard />
                        <NotificationsCard />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function AppearanceCard() {
    const { setTheme, theme } = useTheme()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                    Customize the look and feel of the interface.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 max-w-sm">
                    <div
                        className={`cursor-pointer rounded-lg border-2 p-1 hover:border-primary ${theme === 'light' ? 'border-primary' : 'border-transparent'}`}
                        onClick={() => setTheme('light')}
                    >
                        <div className="space-y-2 rounded-md bg-[#ecedef] p-2">
                            <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                                <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                                <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                            </div>
                            <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                                <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                                <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                            </div>
                        </div>
                        <div className="p-2 text-center text-sm font-medium">Light</div>
                    </div>

                    <div
                        className={`cursor-pointer rounded-lg border-2 p-1 hover:border-primary ${theme === 'dark' ? 'border-primary' : 'border-transparent'}`}
                        onClick={() => setTheme('dark')}
                    >
                        <div className="space-y-2 rounded-md bg-slate-950 p-2">
                            <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                                <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                            </div>
                            <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                <div className="h-4 w-4 rounded-full bg-slate-400" />
                                <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                            </div>
                        </div>
                        <div className="p-2 text-center text-sm font-medium">Dark</div>
                    </div>

                    <div
                        className={`cursor-pointer rounded-lg border-2 p-1 hover:border-primary ${theme === 'system' ? 'border-primary' : 'border-transparent'}`}
                        onClick={() => setTheme('system')}
                    >
                        <div className="space-y-2 rounded-md bg-slate-950 p-2">
                            <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                                <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                            </div>
                            <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                <div className="h-4 w-4 rounded-full bg-slate-400" />
                                <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                            </div>
                        </div>
                        <div className="p-2 text-center text-sm font-medium">System</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function NotificationsCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                    Configure how you receive notifications.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-x-2 bg-muted/40 p-4 rounded-lg">
                    <div className="flex items-center space-x-4">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        <div className="space-y-0.5">
                            <Label className="text-base">Push Notifications</Label>
                            <p className="text-xs text-muted-foreground">Receive notifications on your device through the browser.</p>
                        </div>
                    </div>
                    <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-2 bg-muted/40 p-4 rounded-lg">
                    <div className="flex items-center space-x-4">
                        <div className="h-5 w-5 flex items-center justify-center text-muted-foreground">@</div>
                        <div className="space-y-0.5">
                            <Label className="text-base">Email Notifications</Label>
                            <p className="text-xs text-muted-foreground">Receive daily summaries and critical alerts via email.</p>
                        </div>
                    </div>
                    <Switch defaultChecked />
                </div>
            </CardContent>
        </Card>
    )
}
