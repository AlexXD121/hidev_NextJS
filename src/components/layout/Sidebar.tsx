"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, MessageSquare, Users, Megaphone, Settings, LogOut, FileText, ChevronLeft, ChevronRight, Menu } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CURRENT_USER } from "@/lib/mockData"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import Image from "next/image"
import { useAuthStore } from "@/store/useAuthStore"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

function LogoutButton({ isCollapsed }: { isCollapsed: boolean }) {
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    window.location.href = "/login"
  }

  return (
    <button
      onClick={handleLogout}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors relative group",
        isCollapsed ? "justify-center" : "justify-start px-4"
      )}
    >
      <LogOut className="h-5 w-5 shrink-0" />
      <AnimatePresence>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="overflow-hidden whitespace-nowrap"
          >
            Logout
          </motion.span>
        )}
      </AnimatePresence>

      {isCollapsed && (
        <div className="absolute left-14 z-50 rounded bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
          Logout
        </div>
      )}
    </button>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(true)

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)

  return (
    <motion.div
      initial={{ width: 80 }}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
      className="relative flex h-screen flex-col shrink-0 border-r bg-secondary/50 backdrop-blur-xl text-foreground z-40"
    >
      {/* Header / Logo */}
      <div className={cn("flex items-center gap-3 py-6 px-4 h-20", isCollapsed ? "justify-center" : "")}>
        <div className="relative h-10 w-10 shrink-0 rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:scale-105">
          <Image
            src="/icon-192x192.png"
            alt="Logo"
            fill
            className="object-cover"
            sizes="40px"
            priority
          />
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="flex flex-col overflow-hidden whitespace-nowrap"
            >
              <span className="text-lg font-bold tracking-tight text-foreground">WhatsApp Biz</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Dashboard</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className={cn(
          "absolute z-50 hidden lg:flex items-center justify-center p-0 shadow-md border bg-background hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors",
          isCollapsed
            ? "left-1/2 -translate-x-1/2 top-[76px] h-6 w-6 rounded-full" // Smaller, neat circle below logo
            : "right-4 top-8 h-8 w-8" // Inside right when expanded
        )}
      >
        {isCollapsed ? <Menu className="h-3 w-3" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      {/* Navigation */}
      <nav className={cn("flex-1 space-y-2 px-2 scrollbar-hide overflow-y-auto transition-all duration-300", isCollapsed ? "mt-10" : "mt-4")}>
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <TooltipProvider key={item.href} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative",
                      isActive
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      isCollapsed ? "justify-center" : ""
                    )}
                  >
                    <item.icon className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="overflow-hidden whitespace-nowrap"
                        >
                          {item.title}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Active Indicator Line for Collapsed State */}
                    {isActive && isCollapsed && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-r-full shadow-[0_0_8px_rgba(37,211,102,0.6)]" />
                    )}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className="flex items-center gap-4">
                    {item.title}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t bg-background/50">
        <div className={cn("flex items-center gap-3 mb-4", isCollapsed ? "justify-center flex-col" : "justify-between")}>
          <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "")}>
            <Avatar className="h-9 w-9 border-2 border-primary/20 cursor-pointer hover:border-primary transition-colors">
              <AvatarImage src={CURRENT_USER.avatar} alt={CURRENT_USER.name} />
              <AvatarFallback>
                {CURRENT_USER.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex flex-col overflow-hidden whitespace-nowrap"
                >
                  <span className="text-sm font-medium">{CURRENT_USER.name}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-[100px]" title={CURRENT_USER.email}>
                    {CURRENT_USER.email}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mode Toggle - Hide text or adjust if collapsed, but usually ModeToggle is just an icon */}
          <div className={cn("transition-all", isCollapsed ? "mt-2" : "")}>
            <ModeToggle />
          </div>
        </div>

        <LogoutButton isCollapsed={isCollapsed} />
      </div>
    </motion.div>
  )
}

