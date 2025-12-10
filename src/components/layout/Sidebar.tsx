"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, MessageSquare, Users, Megaphone, Settings, LogOut } from "lucide-react"

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
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col shrink-0 border-r border-[#1a202c] bg-slate-950 text-white transition-all duration-300">
      <div className="flex items-center gap-2 px-6 py-8">
        <div className="h-8 w-8 rounded-full bg-[#25D366] flex items-center justify-center">
          <MessageSquare className="h-5 w-5 text-white fill-current" />
        </div>
        <span className="text-xl font-bold tracking-tight">WhatsApp Biz</span>
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
                  ? "bg-[#128C7E] text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
              {item.title}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[#1a202c]">
        <div className="flex items-center gap-3 mb-4 px-2">
          <Avatar className="h-9 w-9 border border-slate-700">
            <AvatarImage src={CURRENT_USER.avatar} alt={CURRENT_USER.name} />
            <AvatarFallback className="bg-slate-800 text-slate-200">
              {CURRENT_USER.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">{CURRENT_USER.name}</span>
            <span className="text-xs text-slate-400 truncate max-w-[120px]" title={CURRENT_USER.email}>
              {CURRENT_USER.email}
            </span>
          </div>
        </div>
        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-400 hover:bg-red-900/20 hover:text-red-400 transition-colors">
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  )
}
