"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, UserPlus } from "lucide-react";
import { useContactsStore } from "@/store/useContactsStore";
import { useChatStore } from "@/store/useChatStore";

interface NewChatDialogProps {
    children: React.ReactNode;
}

export function NewChatDialog({ children }: NewChatDialogProps) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { contacts } = useContactsStore();
    const { startChat } = useChatStore();

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleStartChat = (contact: any) => {
        startChat(contact);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>New Chat</DialogTitle>
                </DialogHeader>
                <div className="flex items-center space-x-2 border-b pb-4 mb-4">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search contacts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-none focus-visible:ring-0 px-0"
                    />
                </div>
                <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-2">
                        {filteredContacts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                                <UserPlus className="h-8 w-8 mb-2 opacity-50" />
                                <p>No contacts found</p>
                            </div>
                        ) : (
                            filteredContacts.map((contact) => (
                                <button
                                    key={contact.id}
                                    onClick={() => handleStartChat(contact)}
                                    className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <Avatar>
                                        <AvatarImage src={contact.avatar} />
                                        <AvatarFallback>{contact.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 text-left">
                                        <p className="font-medium">{contact.name}</p>
                                        <p className="text-sm text-muted-foreground truncate">{contact.phone}</p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
