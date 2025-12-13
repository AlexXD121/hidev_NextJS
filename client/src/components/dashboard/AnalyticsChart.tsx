"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";

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

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-xl border bg-background/80 backdrop-blur-sm p-4 shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                <p className="mb-2 font-medium text-foreground">{label}</p>
                <div className="flex flex-col gap-1">
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                            <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-sm text-muted-foreground">
                                {entry.name}: <span className="font-medium text-foreground">{entry.value}</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

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
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#888888', strokeWidth: 1, strokeDasharray: '5 5' }} />
                            <Area
                                type="monotone"
                                dataKey="sent"
                                stroke="#25D366"
                                fillOpacity={1}
                                fill="url(#colorSent)"
                                strokeWidth={2}
                                name="Sent"
                                animationDuration={1500}
                            />
                            <Area
                                type="monotone"
                                dataKey="read"
                                stroke="#34B7F1"
                                fillOpacity={1}
                                fill="url(#colorRead)"
                                strokeWidth={2}
                                name="Read"
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
