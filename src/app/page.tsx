"use client";

import { StatsCard } from "@/components/dashboard/StatsCard";
import { Users, MessageSquare, Megaphone, MousePointerClick } from "lucide-react";
import { MOCK_CONTACTS, MOCK_CHATS, MOCK_CAMPAIGNS } from "@/lib/mockData";

export default function DashboardPage() {
  // Calculate metrics
  const totalContacts = MOCK_CONTACTS.length;
  const activeChats = MOCK_CHATS.filter((c) => c.status === "active").length;
  const sentCampaigns = MOCK_CAMPAIGNS.filter((c) => c.status === "sent").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back to your command center.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Contacts"
          value={totalContacts}
          icon={Users}
          trend="+12% from last month"
          trendUp={true}
        />
        <StatsCard
          title="Active Chats"
          value={activeChats}
          icon={MessageSquare}
          trend="+5 new today"
          trendUp={true}
        />
        <StatsCard
          title="Campaigns Sent"
          value={sentCampaigns}
          icon={Megaphone}
          trend="+2 this week"
          trendUp={true}
        />
        <StatsCard
          title="Total Read"
          value="85%"
          icon={MousePointerClick}
          trend="+4.3% engagement"
          trendUp={true}
        />
      </div>
    </div>
  );
}
