import { User, Contact, ChatSession, Campaign, Message, Template } from "@/types";

export const CURRENT_USER: User = {
    id: "u1",
    name: "Admin User",
    avatar: "https://github.com/shadcn.png",
    role: "admin",
    email: "admin@whatsapp-dashboard.com",
};

export const MOCK_CONTACTS: Contact[] = [
    {
        id: "c1",
        name: "Rohan Gupta",
        phone: "+91 98765 43210",
        tags: ["VIP", "Lead"],
        lastActive: "2023-10-27T10:30:00Z",
        avatar: "https://i.pravatar.cc/150?u=c1",
    },
    {
        id: "c2",
        name: "Priya Sharma",
        phone: "+91 98123 45678",
        tags: ["Customer"],
        lastActive: "2023-10-26T14:15:00Z",
        avatar: "https://i.pravatar.cc/150?u=c2",
    },
    {
        id: "c3",
        name: "Amit Patel",
        phone: "+91 99887 76655",
        tags: ["New"],
        lastActive: "2023-10-27T09:00:00Z",
        avatar: "https://i.pravatar.cc/150?u=c3",
    },
];

const MOCK_MESSAGES: Record<string, Message> = {
    m1: {
        id: "m1",
        chatId: "chat1",
        senderId: "c1",
        text: "Hey, I had a question about the pricing plan.",
        timestamp: "2023-10-27T10:30:00Z",
        status: "read",
        type: "text",
    },
    m2: {
        id: "m2",
        chatId: "chat2",
        senderId: "me",
        text: "Your order has been shipped!",
        timestamp: "2023-10-26T14:15:00Z",
        status: "delivered",
        type: "text",
    },
    m3: {
        id: "m3",
        chatId: "chat3",
        senderId: "c3",
        text: "Can you schedule a demo?",
        timestamp: "2023-10-27T09:00:00Z",
        status: "sent",
        type: "text",
    },
};

export const MOCK_MSG_HISTORY: Record<string, Message[]> = {
    chat1: [
        {
            id: "h1",
            chatId: "chat1",
            senderId: "c1",
            text: "Hi there, I saw your ad on Instagram.",
            timestamp: "2023-10-27T10:25:00Z",
            status: "read",
            type: "text"
        },
        {
            id: "h2",
            chatId: "chat1",
            senderId: "me",
            text: "Hello! Thanks for reaching out. How can I help you today?",
            timestamp: "2023-10-27T10:26:00Z",
            status: "read",
            type: "text"
        },
        {
            id: "m1",
            chatId: "chat1",
            senderId: "c1",
            text: "Hey, I had a question about the pricing plan.",
            timestamp: "2023-10-27T10:30:00Z",
            status: "read",
            type: "text",
        }
    ]
}

export const MOCK_CHATS: ChatSession[] = [
    {
        id: "chat1",
        contactId: "c1",
        contact: MOCK_CONTACTS[0],
        lastMessage: MOCK_MESSAGES.m1,
        unreadCount: 2,
        status: "active",
    },
    {
        id: "chat2",
        contactId: "c2",
        contact: MOCK_CONTACTS[1],
        lastMessage: MOCK_MESSAGES.m2,
        unreadCount: 0,
        status: "archived",
    },
    {
        id: "chat3",
        contactId: "c3",
        contact: MOCK_CONTACTS[2],
        lastMessage: MOCK_MESSAGES.m3,
        unreadCount: 0,
        status: "active",
    },
];

export const MOCK_CAMPAIGNS: Campaign[] = [
    {
        id: "camp1",
        name: "Diwali Sale 2023",
        status: "sent",
        sentCount: 1500,
        deliveredCount: 1450,
        readCount: 1200,
        totalContacts: 1500,
        createdAt: "2023-10-20T10:00:00Z",
        templateName: "diwali_offer_v1",
    },
    {
        id: "camp2",
        name: "New Year Promo",
        status: "scheduled",
        sentCount: 0,
        deliveredCount: 0,
        readCount: 0,
        totalContacts: 2000,
        createdAt: "2023-10-27T11:00:00Z",
        templateName: "new_year_blast",
    },
];

export const MOCK_TEMPLATES = [
    {
        id: "t1",
        name: "Welcome Message",
        language: "en",
        status: "approved" as const,
        category: "MARKETING" as const,
        lastUpdated: "2023-10-27T10:00:00Z",
        usageCount: 15,
        components: [
            {
                type: "BODY" as const,
                text: "Hi {{1}}, welcome to our service! We're glad to have you with us.",
                example: { body_text: [["John"]] }
            }
        ]
    },
    {
        id: "t2",
        name: "Order Confirmation",
        language: "en",
        status: "approved" as const,
        category: "UTILITY" as const,
        lastUpdated: "2023-10-27T09:00:00Z",
        usageCount: 32,
        components: [
            {
                type: "BODY" as const,
                text: "Hello {{1}}, your order #{{2}} has been confirmed and will ship soon.",
                example: { body_text: [["John", "12345"]] }
            }
        ]
    },
    {
        id: "t3",
        name: "Diwali Offer",
        language: "en",
        status: "approved" as const,
        category: "MARKETING" as const,
        lastUpdated: "2023-10-26T15:00:00Z",
        usageCount: 8,
        components: [
            {
                type: "HEADER" as const,
                format: "TEXT" as const,
                text: "🎉 Special Diwali Offer!"
            },
            {
                type: "BODY" as const,
                text: "Happy Diwali {{1}}! Get 50% off on all items this festive season. Shop now!",
                example: { body_text: [["John"]] }
            },
            {
                type: "FOOTER" as const,
                text: "Valid until November 15th"
            }
        ]
    },
    {
        id: "t4",
        name: "Appointment Reminder",
        language: "en",
        status: "approved" as const,
        category: "UTILITY" as const,
        lastUpdated: "2023-10-25T12:00:00Z",
        usageCount: 24,
        components: [
            {
                type: "BODY" as const,
                text: "Dear {{1}}, this is a reminder for your appointment on {{2}} at {{3}}.",
                example: { body_text: [["John", "November 1st", "2:00 PM"]] }
            },
            {
                type: "BUTTONS" as const,
                buttons: [
                    {
                        type: "QUICK_REPLY" as const,
                        text: "Confirm"
                    },
                    {
                        type: "QUICK_REPLY" as const,
                        text: "Reschedule"
                    }
                ]
            }
        ]
    }
];
