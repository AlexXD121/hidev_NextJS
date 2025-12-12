"use client"

import { Contact } from "@/types"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, Phone, Mail, Calendar, Tag, X, Edit2, History } from "lucide-react"
import { format } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useContactsStore } from "@/store/useContactsStore"
import { useRouter } from "next/navigation"

interface ContactDetailsSheetProps {
    contact: Contact | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ContactDetailsSheet({ contact, open, onOpenChange }: ContactDetailsSheetProps) {
    const router = useRouter()
    // In a real app, these would come from store actions
    const onStartChat = () => {
        if (!contact) return
        // Ideally navigate to chat with this contact selected
        router.push(`/chat?contactId=${contact.id}`)
        onOpenChange(false)
    }

    if (!contact) return null

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0">
                <div className="bg-secondary/30 p-6 pb-2">
                    <SheetHeader className="mb-6">
                        <SheetTitle>Contact Profile</SheetTitle>
                        <SheetDescription>View and manage contact details</SheetDescription>
                    </SheetHeader>

                    <div className="flex flex-col items-center text-center">
                        <Avatar className="h-24 w-24 mb-4 border-4 border-background shadow-sm">
                            <AvatarImage src={contact.avatar} />
                            <AvatarFallback className="text-xl bg-primary/10 text-primary">
                                {(contact.name || "C").substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <h2 className="text-2xl font-bold text-foreground">{contact.name}</h2>
                        <p className="text-muted-foreground font-mono mt-1">{contact.phone}</p>

                        <div className="flex gap-2 mt-6 w-full justify-center">
                            <Button className="bg-[#25D366] hover:bg-[#128C7E] flex-1 max-w-[140px]" onClick={onStartChat}>
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Chat
                            </Button>
                            <Button variant="outline" className="flex-1 max-w-[140px]">
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit
                            </Button>
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-1 px-6 py-4">
                    <div className="space-y-6">
                        {/* Tags Section */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                                <Tag className="w-4 h-4" />
                                <span>Tags</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {contact.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm bg-secondary hover:bg-secondary/80">
                                        {tag}
                                        <button className="ml-2 hover:text-destructive transition-colors">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))}
                                <Button variant="ghost" size="sm" className="h-7 text-xs border border-dashed">
                                    + Add Tag
                                </Button>
                            </div>
                        </div>

                        <Separator />

                        {/* Details Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-muted-foreground">Details</h3>

                            <div className="grid grid-cols-[24px_1fr] gap-4 items-center">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{contact.email || "No email provided"}</span>
                            </div>

                            <div className="grid grid-cols-[24px_1fr] gap-4 items-center">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <div className="text-sm">
                                    <p>Last Active</p>
                                    <p className="text-muted-foreground text-xs">
                                        {format(new Date(contact.lastActive), "PPP p")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Recent History Mock */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                                <History className="w-4 h-4" />
                                <span>History</span>
                            </div>
                            <div className="space-y-4 pl-2 border-l-2 border-muted ml-2">
                                <div className="relative pl-6 pb-2">
                                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-primary" />
                                    <p className="text-sm font-medium">Message Sent</p>
                                    <p className="text-xs text-muted-foreground">Template "Order Confirmation" sent</p>
                                    <p className="text-[10px] text-muted-foreground mt-1">Today, 10:23 AM</p>
                                </div>
                                <div className="relative pl-6">
                                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-muted-foreground/30" />
                                    <p className="text-sm font-medium">Contact Created</p>
                                    <p className="text-xs text-muted-foreground">Imported from CSV</p>
                                    <p className="text-[10px] text-muted-foreground mt-1">Yesterday</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}
