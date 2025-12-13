"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, UserPlus, Megaphone, CheckCircle2 } from "lucide-react";

export interface ActivityItem {
    id: string;
    type: "message" | "contact" | "campaign" | "system";
    title: string;
    description: string;
    timestamp: string;
    user?: {
        name: string;
        avatar?: string;
        initials: string;
    };
}

interface RecentActivityProps {
    activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
    const getIcon = (type: string) => {
        switch (type) {
            case "message":
                return <MessageSquare className="h-4 w-4 text-blue-500" />;
            case "contact":
                return <UserPlus className="h-4 w-4 text-green-500" />;
            case "campaign":
                return <Megaphone className="h-4 w-4 text-purple-500" />;
            default:
                return <CheckCircle2 className="h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <Card className="col-span-3 h-full">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {activities.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No recent activity.</p>
                    ) : (
                        activities.map((activity, index) => (
                            <div key={`${activity.id}-${index}`} className="flex items-center">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={activity.user?.avatar} alt={activity.user?.name} />
                                    <AvatarFallback>{activity.user?.initials || "SYS"}</AvatarFallback>
                                </Avatar>
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">{activity.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {activity.description}
                                    </p>
                                </div>
                                <div className="ml-auto font-medium text-xs text-muted-foreground flex items-center gap-1">
                                    {getIcon(activity.type)}
                                    {activity.timestamp}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
