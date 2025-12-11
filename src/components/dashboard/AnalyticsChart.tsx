"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts";

interface ChartData {
    date: string;
    sent: number;
    delivered: number;
    read: number;
}

interface AnalyticsChartProps {
    data: ChartData[];
    title?: string;
    description?: string;
}

export function AnalyticsChart({ data, title = "Message Trends", description = "Sent vs Delivered vs Read over the last 7 days" }: AnalyticsChartProps) {
    // Don't render chart if no data
    if (!data || data.length === 0) {
        return (
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="h-[350px] w-full flex items-center justify-center text-muted-foreground">
                        No data available
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <p className="text-sm text-muted-foreground">{description}</p>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[350px] w-full min-h-[350px]">
                    <ResponsiveContainer width="100%" height={350} minHeight={350}>
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#25D366" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#25D366" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorRead" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#34B7F1" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#34B7F1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ fontSize: '12px' }}
                                labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                            />
                            <Area type="monotone" dataKey="sent" stroke="#25D366" fillOpacity={1} fill="url(#colorSent)" strokeWidth={2} name="Sent" />
                            <Area type="monotone" dataKey="read" stroke="#34B7F1" fillOpacity={1} fill="url(#colorRead)" strokeWidth={2} name="Read" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
