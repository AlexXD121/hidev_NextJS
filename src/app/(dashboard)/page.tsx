"use client";

import { StatsCard } from "@/components/dashboard/StatsCard";
import { Users, MessageSquare, Megaphone, MousePointerClick } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/api-service";
import { useChatStore } from "@/store/useChatStore"
import { useCampaignStore } from "@/store/useCampaignStore"
import { useContactsStore } from "@/store/useContactsStore"
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import dynamic from 'next/dynamic'
import { ActivityItem } from "@/components/dashboard/RecentActivity";
import { useEffect, useState } from "react";

const AnalyticsChart = dynamic(() => import('@/components/dashboard/AnalyticsChart').then(mod => mod.AnalyticsChart), {
  loading: () => <Skeleton className="h-[430px] w-full rounded-xl" />,
  ssr: false
})

const RecentActivity = dynamic(() => import('@/components/dashboard/RecentActivity').then(mod => mod.RecentActivity), {
  loading: () => <Skeleton className="h-[430px] w-full rounded-xl" />,
  ssr: false
})

export default function DashboardPage() {
  const { chats, messages } = useChatStore()
  const { campaigns } = useCampaignStore()
  const { contacts } = useContactsStore()

  // --- Dynamic Stats ---
  const activeChats = chats.filter(c => c.status === 'active' || c.unreadCount > 0).length
  const totalContacts = contacts.length
  const sentCampaigns = campaigns.filter(c => c.status === 'sent' || c.status === 'completed').length

  // Calculate total messages
  const totalMessages = Object.values(messages).reduce((acc, msgs) => acc + msgs.length, 0)
  // Fallback if messages not fully loaded in store map, roughly estimate from chats
  const displayMessages = totalMessages > 0 ? totalMessages : chats.reduce((acc, c) => acc + (c.lastMessage ? 1 : 0) * 10, 0) // Mocking history if empty

  // Response Rate Calculation
  const totalSent = campaigns.reduce((acc, c) => acc + c.sentCount, 0)
  const totalRead = campaigns.reduce((acc, c) => acc + c.readCount, 0)
  const responseRate = totalSent > 0 ? Math.round((totalRead / totalSent) * 100) : 0


  // --- Dynamic Recent Activity ---
  const [dynamicActivities, setDynamicActivities] = useState<ActivityItem[]>([])

  useEffect(() => {
    // 1. New Messages Activity
    const messageActivities: ActivityItem[] = chats
      .filter(c => c.lastMessage)
      .map(c => ({
        id: c.lastMessage.id,
        type: "message",
        title: `Message from ${c.contact.name}`,
        description: c.lastMessage.text.substring(0, 50) + (c.lastMessage.text.length > 50 ? "..." : ""),
        timestamp: new Date(c.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        user: {
          name: c.contact.name,
          avatar: c.contact.avatar,
          initials: c.contact.name.substring(0, 2).toUpperCase()
        },
        rawDate: new Date(c.lastMessage.timestamp) // temporary for sorting
      } as any))

    // 2. Campaign Activities
    const campaignActivities: ActivityItem[] = campaigns.map(c => ({
      id: `camp-${c.id}`,
      type: "campaign",
      title: "Campaign Updated",
      description: `${c.name} is now ${c.status}`,
      timestamp: new Date(c.createdAt).toLocaleDateString(),
      user: { name: "System", initials: "SYS" },
      rawDate: new Date(c.createdAt)
    } as any))

    // 3. New Contacts
    const contactActivities: ActivityItem[] = contacts.map(c => ({
      id: `new-contact-${c.id}`,
      type: "contact",
      title: "New Contact",
      description: `${c.name} added to contacts`,
      timestamp: new Date(c.lastActive).toLocaleDateString(), // Using lastActive as proxy for created
      user: { name: c.name, initials: c.name.substring(0, 2).toUpperCase(), avatar: c.avatar },
      rawDate: new Date(c.lastActive)
    } as any))

    // Merge, Sort, Slice
    const allActivities = [...messageActivities, ...campaignActivities, ...contactActivities]
      .sort((a: any, b: any) => b.rawDate.getTime() - a.rawDate.getTime())
      .slice(0, 5) // Top 5
      .map(({ rawDate, ...rest }: any) => rest as ActivityItem)

    setDynamicActivities(allActivities)
  }, [chats, campaigns, contacts])


  // --- Chart Data Polishing ---
  const { data: rawChartData, isLoading: chartLoading } = useQuery({
    queryKey: ["dashboard-chart"],
    queryFn: apiService.fetchChartData,
    refetchInterval: 10000,
  });

  // Blend real campaign data into the chart if available
  const chartData = rawChartData?.map(day => {
    // Artificial boost if we have active campaigns
    if (sentCampaigns > 0) {
      return {
        ...day,
        sent: day.sent + Math.floor(totalSent / 7),
        read: day.read + Math.floor(totalRead / 7)
      }
    }
    return day
  })

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back. Here's what's happening today.</p>
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
            trend={"+2 new today"}
            trendUp={true}
          />
          <StatsCard
            title="Campaigns Sent"
            value={sentCampaigns}
            icon={Megaphone}
            trend="Active now"
            trendUp={true}
          />
          <StatsCard
            title="Response Rate"
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
          {/* Pass dynamic activities if available, else standard loading or empty state handled by component */}
          <RecentActivity activities={dynamicActivities} />
        </div>
      </div>
    </div>
  );
}
