"use client"

import { useCampaignStore } from "@/store/useCampaignStore"
import { Button } from "@/components/ui/button"
import { Plus, Copy } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CampaignAnalytics } from "@/components/campaigns/CampaignAnalytics"
import { toast } from "sonner"

export default function CampaignsPage() {
    const { campaigns, startSimulation, duplicateCampaign } = useCampaignStore()

    const handleDuplicate = (id: string) => {
        duplicateCampaign(id)
        toast.success("Campaign Duplicated", {
            description: "A copy of the campaign has been created as draft."
        })
    }

    return (
        <div className="space-y-6 p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Campaigns</h1>
                    <p className="text-muted-foreground">Manage and track your whatsapp campaigns.</p>
                </div>
                <Link href="/campaigns/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Campaign
                    </Button>
                </Link>
            </div>

            <CampaignAnalytics />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {campaigns.map((campaign) => (
                    <Card key={campaign.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium truncate pr-2">
                                {campaign.name}
                            </CardTitle>
                            <Badge variant={
                                campaign.status === 'completed' ? 'default' :
                                    campaign.status === 'sending' ? 'secondary' :
                                        'outline'
                            }>
                                {campaign.status}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{campaign.sentCount} / {campaign.totalContacts}</div>
                            <p className="text-xs text-muted-foreground mb-4">
                                Messages Sent
                            </p>

                            <div className="space-y-2">
                                <Progress value={(campaign.sentCount / campaign.totalContacts) * 100} />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Delivered: {campaign.deliveredCount}</span>
                                    <span>Read: {campaign.readCount}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                                {campaign.status === 'scheduled' && (
                                    <Button
                                        className="flex-1"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => startSimulation(campaign.id)}
                                    >
                                        Start Simulation
                                    </Button>
                                )}
                                {campaign.status === 'sending' && (
                                    <Button
                                        className="flex-1"
                                        size="sm"
                                        variant="outline"
                                        disabled
                                    >
                                        Sending...
                                    </Button>
                                )}
                                {(campaign.status === 'draft' || campaign.status === 'completed' || campaign.status === 'failed') && (
                                    <Button
                                        className="flex-1"
                                        size="sm"
                                        variant="secondary"
                                        disabled
                                    >
                                        {campaign.status === 'draft' ? 'Continue Setup' : 'View Report'}
                                    </Button>
                                )}

                                <Button size="sm" variant="ghost" className="px-2" onClick={() => handleDuplicate(campaign.id)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
