import { ContactsTable } from "@/components/contacts/ContactsTable";
import { MOCK_CONTACTS } from "@/lib/mockData";

export default function ContactsPage() {
    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Contacts</h2>
                    <p className="text-muted-foreground">
                        Manage your customer database and leads.
                    </p>
                </div>
            </div>
            <ContactsTable data={MOCK_CONTACTS} />
        </div>
    );
}
