"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCampaignStore } from "@/store/useCampaignStore"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

export function CampaignAnalytics() {
    const { campaigns } = useCampaignStore()

    // Aggregate data
    const totalSent = campaigns.reduce((acc, curr) => acc + curr.sentCount, 0)
    const totalDelivered = campaigns.reduce((acc, curr) => acc + curr.deliveredCount, 0)
    const totalRead = campaigns.reduce((acc, curr) => acc + curr.readCount, 0)

    // Determine overall success rate (Read / Sent)
    const successRate = totalSent > 0 ? Math.round((totalRead / totalSent) * 100) : 0

    const data = [
        {
            name: "Total",
            Sent: totalSent,
            Delivered: totalDelivered,
            Read: totalRead
        }
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Campaign Performance</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Legend />
                            <Bar dataKey="Sent" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Delivered" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Read" fill="#22c55e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">Total Campaigns</div>
                            <div className="text-2xl font-bold">{campaigns.length}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">Total Messages Sent</div>
                            <div className="text-2xl font-bold">{totalSent}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">Avg. Success Rate</div>
                            <div className="text-2xl font-bold text-green-600">{successRate}%</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
