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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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


export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(true)
  const { user, logout } = useAuthStore()

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)

  const handleLogout = () => {
    logout()
    window.location.href = "/login"
  }

  // Fallback to mock user if not logged in (for development/preview)
  const currentUser = user || CURRENT_USER

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
            ? "left-1/2 -translate-x-1/2 top-[76px] h-6 w-6 rounded-full"
            : "right-4 top-8 h-8 w-8"
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className={cn("flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-accent transition-colors group", isCollapsed ? "justify-center flex-col" : "justify-between")}>
              <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "")}>
                <Avatar className="h-9 w-9 border-2 border-primary/20 group-hover:border-primary transition-colors">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback>
                    {currentUser.name?.slice(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="flex flex-col overflow-hidden whitespace-nowrap text-left"
                    >
                      <span className="text-sm font-medium truncate w-[140px]">{currentUser.name}</span>
                      <span className="text-xs text-muted-foreground truncate w-[140px]">
                        {currentUser.email}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {!isCollapsed && <Settings className="h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100" />}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" side="right" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/settings">
                <DropdownMenuItem className="cursor-pointer">
                  Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
              </Link>
              <Link href="/settings">
                <DropdownMenuItem className="cursor-pointer">
                  Settings
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-0 text-red-600 focus:text-red-500">
              <div onClick={handleLogout} className="flex w-full items-center px-2 py-1.5 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  )
}

