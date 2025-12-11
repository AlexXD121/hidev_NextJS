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

// Initial mock activities
let MOCK_ACTIVITIES: ActivityItem[] = [
    {
        id: "1",
        type: "message",
        title: "New message from Alice",
        description: "Hey, can we schedule a demo?",
        timestamp: "2 min ago",
        user: { name: "Alice Smith", initials: "AS" },
    },
    {
        id: "2",
        type: "contact",
        title: "New contact added",
        description: "Bob Johnson joined via website",
        timestamp: "15 min ago",
        user: { name: "Bob Johnson", initials: "BJ" },
    },
    {
        id: "3",
        type: "campaign",
        title: "Campaign 'Summer Sale' sent",
        description: "Delivered to 150 contacts",
        timestamp: "1 hour ago",
        user: { name: "System", initials: "SYS" },
    },
    {
        id: "4",
        type: "message",
        title: "Reply from Carol",
        description: "Interested in the premium plan",
        timestamp: "3 hours ago",
        user: { name: "Carol White", initials: "CW" },
    },
    {
        id: "5",
        type: "system",
        title: "System Update",
        description: "Dashboard features updated",
        timestamp: "5 hours ago",
        user: { name: "System", initials: "SYS" },
    },
];

// Simulate latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiService = {
    fetchDashboardStats: async (): Promise<DashboardStats> => {
        // Simulate network delay between 500ms and 1500ms
        await delay(500 + Math.random() * 1000);

        // Randomize active chats slightly to simulate real-time updates
        const randomActiveChats =
            MOCK_CHATS.filter((c) => c.status === "active").length +
            Math.floor(Math.random() * 3); // Add 0-2 random active chats

        // Randomize response rate slightly
        const randomResponseRate = 85 + Math.random() * 5;

        return {
            totalContacts: MOCK_CONTACTS.length,
            activeChats: randomActiveChats,
            sentCampaigns: MOCK_CAMPAIGNS.filter((c) => c.status === "sent").length,
            responseRate: parseFloat(randomResponseRate.toFixed(1)),
        };
    },

    fetchChartData: async (): Promise<ChartData[]> => {
        await delay(500); // Simulate shorter delay for chart

        // Generate last 7 days data
        const data: ChartData[] = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dayName = d.toLocaleDateString("en-US", { weekday: "short" });

            // Generate realistic random data
            const baseSent = 150 + Math.floor(Math.random() * 100);
            const sent = baseSent;
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

        // Simulate real-time: Randomly add a new activity occasionally
        if (Math.random() > 0.7) {
            const newActivities = [
                {
                    id: Date.now().toString(),
                    type: "message" as const,
                    title: "New message from Visitor",
                    description: "Is this still available?",
                    timestamp: "Just now",
                    user: { name: "Visitor", initials: "V" },
                },
                {
                    id: Date.now().toString(),
                    type: "contact" as const,
                    title: "New Lead Captured",
                    description: "Form submission from Landing Page",
                    timestamp: "Just now",
                    user: { name: "Lead", initials: "L" },
                },
            ];
            const randomActivity =
                newActivities[Math.floor(Math.random() * newActivities.length)];
            MOCK_ACTIVITIES = [randomActivity, ...MOCK_ACTIVITIES].slice(0, 5);
        }

        return MOCK_ACTIVITIES;
    },
};
