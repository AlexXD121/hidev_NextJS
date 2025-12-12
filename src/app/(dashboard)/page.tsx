"use client";

import { StatsCard } from "@/components/dashboard/StatsCard";
import { Users, MessageSquare, Megaphone, MousePointerClick } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/api-service";
import { useChatStore } from "@/store/useChatStore"
import { useCampaignStore } from "@/store/useCampaignStore"
import { MOCK_CONTACTS } from "@/lib/mockData"
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import dynamic from 'next/dynamic'

const AnalyticsChart = dynamic(() => import('@/components/dashboard/AnalyticsChart').then(mod => mod.AnalyticsChart), {
  loading: () => <Skeleton className="h-[430px] w-full rounded-xl" />,
  ssr: false
})

const RecentActivity = dynamic(() => import('@/components/dashboard/RecentActivity').then(mod => mod.RecentActivity), {
  loading: () => <Skeleton className="h-[430px] w-full rounded-xl" />,
  ssr: false
})

export default function DashboardPage() {
  const { chats } = useChatStore()
  const { campaigns } = useCampaignStore()

  // Calculate dynamic stats
  const activeChats = chats.filter(c => c.status === 'active').length
  const totalContacts = MOCK_CONTACTS.length // Or from a useContactStore if we had one
  const sentCampaigns = campaigns.filter(c => c.status === 'sent' || c.status === 'completed').length

  // Mock response rate logic for now, or derive from campaigns
  const totalSent = campaigns.reduce((acc, c) => acc + c.sentCount, 0)
  const totalRead = campaigns.reduce((acc, c) => acc + c.readCount, 0)
  const responseRate = totalSent > 0 ? Math.round((totalRead / totalSent) * 100) : 0

  const { data: chartData, isLoading: chartLoading, error: chartError } = useQuery({
    queryKey: ["dashboard-chart"],
    queryFn: apiService.fetchChartData,
    refetchInterval: 5000,
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ["recent-activity"],
    queryFn: apiService.fetchRecentActivity,
    refetchInterval: 5000,
  });

  // Handle errors with Toasts
  if (chartError) {
    toast.error("Failed to load chart data", { description: "Please try again later." });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back to your command center.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <>
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
            trend={"+5 new today"}
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
            value={`${responseRate}%`}
            icon={MousePointerClick}
            trend="+4.3% engagement"
            trendUp={true}
          />
        </>
      </div>

      {/* Charts and Activity Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-7">
        <div className="col-span-4">
          <AnalyticsChart data={chartData || []} />
        </div>

        <div className="col-span-3">
          <RecentActivity activities={recentActivity || []} />
        </div>
      </div>
    </div>
  );
}
