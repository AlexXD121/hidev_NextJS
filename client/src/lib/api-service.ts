import { MOCK_CONTACTS, MOCK_CHATS, MOCK_CAMPAIGNS } from "./mockData";

export interface DashboardStats {
    totalContacts: number;
    activeChats: number;
    sentCampaigns: number;
    responseRate: number;
}

export interface ChartData {
    date: string;
    sent: number;
    delivered: number;
    read: number;
}

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

// Helper function to simulate network latency
const delay = (ms: number = 500): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export const apiService = {
    fetchDashboardStats: async (): Promise<DashboardStats> => {
        await delay(500);

        return {
            totalContacts: MOCK_CONTACTS.length,
            activeChats: MOCK_CHATS.filter((chat) => chat.status === "active").length,
            sentCampaigns: MOCK_CAMPAIGNS.filter((campaign) =>
                campaign.status === "sent" || campaign.status === "scheduled"
            ).length,
            responseRate: 85,
        };
    },

    fetchChartData: async (): Promise<ChartData[]> => {
        await delay(500);

        // Generate last 7 days data
        const data: ChartData[] = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

            // Generate realistic random numbers
            const sent = 150 + Math.floor(Math.random() * 100);
            const delivered = Math.floor(sent * (0.9 + Math.random() * 0.1)); // 90-100% delivery
            const read = Math.floor(delivered * (0.7 + Math.random() * 0.2)); // 70-90% read rate

            data.push({
                date: dayName,
                sent,
                delivered,
                read,
            });
        }

        return data;
    },

    fetchRecentActivity: async (): Promise<ActivityItem[]> => {
        await delay(500);

        const activities: ActivityItem[] = [];

        // Create activities from MOCK_CHATS (New Message activities)
        MOCK_CHATS.forEach((chat) => {
            if (chat.lastMessage) {
                activities.push({
                    id: `chat-${chat.id}`,
                    type: "message",
                    title: `New message from ${chat.contact.name}`,
                    description: chat.lastMessage.text,
                    timestamp: getRelativeTime(chat.lastMessage.timestamp),
                    user: {
                        name: chat.contact.name,
                        avatar: chat.contact.avatar,
                        initials: chat.contact.name.split(' ').map(n => n[0]).join('').toUpperCase(),
                    },
                });
            }
        });

        // Create activities from MOCK_CAMPAIGNS (Campaign Sent activities)
        MOCK_CAMPAIGNS.forEach((campaign) => {
            if (campaign.status === "sent") {
                activities.push({
                    id: `campaign-${campaign.id}`,
                    type: "campaign",
                    title: `Campaign '${campaign.name}' sent`,
                    description: `Delivered to ${campaign.totalContacts} contacts`,
                    timestamp: getRelativeTime(campaign.createdAt),
                    user: {
                        name: "System",
                        initials: "SYS",
                    },
                });
            }
        });

        // Sort by most recent first and return top 5
        return activities
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 5);
    },
};

// Helper function to convert ISO date to relative time
function getRelativeTime(isoDate: string): string {
    const date = new Date(isoDate);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
}
