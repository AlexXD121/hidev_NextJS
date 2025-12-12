import { User, Contact, ChatSession, Campaign, Message } from "@/types";

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
        category: "marketing",
        content: "Hi {{name}}, welcome to our service! We're glad to have you with us.",
        language: "en"
    },
    {
        id: "t2",
        name: "Order Confirmation",
        category: "utility",
        content: "Hello {{name}}, your order #{{order_id}} has been confirmed and will ship soon.",
        language: "en"
    },
    {
        id: "t3",
        name: "Diwali Offer",
        category: "marketing",
        content: "Happy Diwali {{name}}! Get 50% off on all items this festive season. Shop now!",
        language: "en"
    },
    {
        id: "t4",
        name: "Appointment Reminder",
        category: "utility",
        content: "Dear {{name}}, this is a reminder for your appointment on {{date}} at {{time}}.",
        language: "en"
    }
];
