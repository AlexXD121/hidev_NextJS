import { CampaignWizard } from "@/components/campaigns/CampaignWizard"

export default function NewCampaignPage() {
    return (
        <div className="container mx-auto py-6 max-w-4xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Create New Campaign</h1>
                <p className="text-muted-foreground">Follow the steps to launch your whatsapp campaign.</p>
            </div>
            <CampaignWizard />
        </div>
    )
}
