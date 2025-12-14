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
    iconSrc: "/imp_icons/dashboard.png",
    href: "/",
  },
  {
    title: "Live Chat",
    icon: MessageSquare,
    iconSrc: "/imp_icons/live chat.png",
    href: "/chat",
  },
  {
    title: "Contacts",
    icon: Users,
    iconSrc: "/imp_icons/user.png",
    href: "/contacts",
  },
  {
    title: "Campaigns",
    icon: Megaphone,
    iconSrc: "/imp_icons/marketing.png",
    href: "/campaigns",
  },
  {
    title: "Templates",
    icon: FileText,
    iconSrc: "/imp_icons/templates.png",
    href: "/templates",
  },
  {
    title: "Settings",
    icon: Settings,
    iconSrc: "/imp_icons/setting.png",
    href: "/settings",
  },
]


interface SidebarProps {
  className?: string
  isMobile?: boolean
  onClose?: () => void
}

export function Sidebar({ className, isMobile = false, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(isMobile ? false : true)
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
      initial={{ width: isMobile ? "100%" : 80 }}
      animate={{ width: isMobile ? "100%" : (isCollapsed ? 80 : 256) }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "relative h-[100dvh] flex-col shrink-0 border-r bg-secondary/50 backdrop-blur-xl text-foreground z-40",
        // Only hide on mobile if NOT explicitly in mobile mode (i.e. default desktop sidebar)
        // Mobile: Hidden by default. Desktop: Flex (Sticky sidebar)
        "hidden lg:flex",
        className
      )}
    >
      {/* Header / Logo */}
      <div className={cn("flex items-center gap-2 py-6 px-4 h-20", isCollapsed && !isMobile ? "justify-center" : "pr-14")}>
        <div className="relative h-8 w-8 shrink-0 rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:scale-105">
          <Image
            src="/icon-192x192.png"
            alt="Logo"
            fill
            className="object-cover"
            sizes="32px"
            priority
          />
        </div>
        <AnimatePresence>
          {(!isCollapsed || isMobile) && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="flex flex-col overflow-hidden whitespace-nowrap"
            >
              <span className="text-sm font-bold tracking-tight text-foreground truncate">
                WhatsApp Business
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold truncate">Dashboard</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle Button - Hide on Mobile */}
      {!isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn(
            "absolute z-50 flex items-center justify-center p-0 shadow-sm border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200",
            isCollapsed
              ? "left-1/2 -translate-x-1/2 top-[76px] h-6 w-6 rounded-full border-2"
              : "right-4 top-8 h-8 w-8 rounded-md"
          )}
        >
          {isCollapsed ? <Menu className="h-3 w-3" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      )}

      {/* Navigation */}
      <nav className={cn("flex-1 space-y-2 px-2 scrollbar-hide overflow-y-auto transition-all duration-300", isCollapsed && !isMobile ? "mt-10" : "mt-4")}>
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <TooltipProvider key={item.href} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    onClick={onClose} // Auto-close on link click if mobile
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative",
                      isActive
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      isCollapsed && !isMobile ? "justify-center" : ""
                    )}
                  >
                    {item.iconSrc ? (
                      <div className="relative h-5 w-5 shrink-0">
                        <Image
                          src={item.iconSrc}
                          alt={item.title}
                          fill
                          className={cn("object-contain dark:invert", isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100")}
                        />
                      </div>
                    ) : (
                      <item.icon className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                    )}
                    <AnimatePresence>
                      {(!isCollapsed || isMobile) && (
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

                    {isActive && isCollapsed && !isMobile && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-r-full shadow-[0_0_8px_rgba(37,211,102,0.6)]" />
                    )}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && !isMobile && (
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
        <div className={cn("flex items-center gap-2", isCollapsed && !isMobile ? "flex-col justify-center" : "justify-between")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className={cn("flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-accent transition-colors group flex-1", isCollapsed && !isMobile ? "justify-center flex-col w-full" : "")}>
                <div className={cn("flex items-center gap-3", isCollapsed && !isMobile ? "justify-center" : "")}>
                  <Avatar className="h-9 w-9 border-2 border-primary/20 group-hover:border-primary transition-colors">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback>
                      {currentUser.name?.slice(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <AnimatePresence>
                    {(!isCollapsed || isMobile) && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="flex flex-col overflow-hidden whitespace-nowrap text-left"
                      >
                        <span className="text-sm font-medium truncate w-[100px]">{currentUser.name}</span>
                        <span className="text-xs text-muted-foreground truncate w-[100px]">
                          {currentUser.email}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {(!isCollapsed || isMobile) && <Settings className="h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100" />}
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

          {/* Theme Toggle - Always visible */}
          <div className={cn("shrink-0", isCollapsed && !isMobile ? "w-full flex justify-center" : "")}>
            <ModeToggle />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
