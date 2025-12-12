import { CampaignWizard } from "@/components/campaigns/CampaignWizard"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function NewCampaignPage() {
    return (
        <ScrollArea className="h-full">
            <div className="container mx-auto py-6 max-w-4xl px-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">Create New Campaign</h1>
                    <p className="text-muted-foreground">Follow the steps to launch your whatsapp campaign.</p>
                </div>
                <CampaignWizard />
            </div>
        </ScrollArea>
    )
}
