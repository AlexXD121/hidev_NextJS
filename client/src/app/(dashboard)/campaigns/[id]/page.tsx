"use client"

import { useCampaignStore } from "@/store/useCampaignStore"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCheck, Send, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CampaignContactsList } from "@/components/campaigns/CampaignContactsList"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function CampaignDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const { campaigns } = useCampaignStore()

    // Safety check for params.id
    const campaignId = Array.isArray(params?.id) ? params?.id[0] : params?.id
    const campaign = campaigns.find(c => c.id === campaignId)

    if (!campaign) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <p className="text-muted-foreground">Campaign not found</p>
                <Button onClick={() => router.push("/campaigns")}>Go Back</Button>
            </div>
        )
    }

    return (
        <ScrollArea className="h-full">
            <div className="p-8 space-y-8 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{campaign.name}</h1>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="capitalize">{campaign.status}</span>
                            <span>•</span>
                            <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sent</CardTitle>
                            <Send className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{campaign.sentCount} / {campaign.totalContacts}</div>
                            <p className="text-xs text-muted-foreground">
                                {((campaign.sentCount / campaign.totalContacts) * 100).toFixed(1)}% Completion
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                            <CheckCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{campaign.deliveredCount}</div>
                            <p className="text-xs text-muted-foreground">
                                {campaign.sentCount > 0 ? ((campaign.deliveredCount / campaign.sentCount) * 100).toFixed(1) : 0}% Delivery Rate
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Read</CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{campaign.readCount}</div>
                            <p className="text-xs text-muted-foreground">
                                {campaign.deliveredCount > 0 ? ((campaign.readCount / campaign.deliveredCount) * 100).toFixed(1) : 0}% Read Rate
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Separator />

                {/* Detailed Contact List */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold tracking-tight">Recipient Activity</h2>
                    <CampaignContactsList
                        totalContacts={campaign.totalContacts}
                        sentCount={campaign.sentCount}
                        deliveredCount={campaign.deliveredCount}
                        readCount={campaign.readCount}
                    />
                </div>
            </div>
        </ScrollArea>
    )
}
