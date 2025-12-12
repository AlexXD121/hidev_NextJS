"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, MessageSquare, Users, Megaphone, Settings, LogOut, FileText } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CURRENT_USER } from "@/lib/mockData"

const sidebarItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Live Chat",
    icon: MessageSquare,
    href: "/chat",
  },
  {
    title: "Contacts",
    icon: Users,
    href: "/contacts",
  },
  {
    title: "Campaigns",
    icon: Megaphone,
    href: "/campaigns",
  },
  {
    title: "Templates",
    icon: FileText,
    href: "/templates",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
]

import { ModeToggle } from "@/components/mode-toggle"
import Image from "next/image"
import { useAuthStore } from "@/store/useAuthStore"

function LogoutButton() {
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    window.location.href = "/login"
  }

  return (
    <button
      onClick={handleLogout}
      className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
    >
      <LogOut className="h-5 w-5" />
      Logout
    </button>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col shrink-0 border-r bg-secondary text-foreground transition-all duration-300">
      <div className="flex items-center gap-3 px-6 py-8 group cursor-pointer">
        <div className="relative h-10 w-10 rounded-xl overflow-hidden shadow-sm transition-all duration-500 ease-out group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(37,211,102,0.5)] group-hover:-rotate-6 border border-transparent group-hover:border-[#25D366]/30">
          <Image
            src="/icon-192x192.png"
            alt="Logo"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-125"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight transition-colors duration-300 group-hover:text-[#25D366]">WhatsApp Biz</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">Dashboard</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
              {item.title}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-9 w-9 border">
              <AvatarImage src={CURRENT_USER.avatar} alt={CURRENT_USER.name} />
              <AvatarFallback>
                {CURRENT_USER.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{CURRENT_USER.name}</span>
              <span className="text-xs text-muted-foreground truncate max-w-[80px]" title={CURRENT_USER.email}>
                {CURRENT_USER.email}
              </span>
            </div>
          </div>
          <ModeToggle />
        </div>

        <LogoutButton />
      </div>
    </div>
  )
}
