"use client";

import { useEffect } from "react";
import { ContactsTable } from "@/components/contacts/ContactsTable";
import { useContactsStore } from "@/store/useContactsStore";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ContactsPage() {
    const { contacts, fetchContacts, isLoading } = useContactsStore();

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    return (
        <ScrollArea className="h-full w-full">
            <div className="h-full w-full flex-1 flex flex-col space-y-8 p-8">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Contacts</h2>
                        <p className="text-muted-foreground">
                            Manage your customer database and leads.
                        </p>
                    </div>
                </div>
                {isLoading && contacts.length === 0 ? (
                    <div className="text-center py-10">Loading contacts...</div>
                ) : (
                    <ContactsTable data={contacts} />
                )}
            </div>
        </ScrollArea>
    );
}
