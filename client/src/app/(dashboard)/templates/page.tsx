import TemplatesList from "@/components/templates/TemplatesList";

export default function TemplatesPage() {
    return (
        <div className="space-y-6 p-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
                    <p className="text-muted-foreground">Manage your WhatsApp message templates</p>
                </div>
            </div>

            <TemplatesList />
        </div>
    );
}
