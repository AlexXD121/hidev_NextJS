import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { Contact, ChatSession, Campaign, Template } from '@/types';

// Contacts
export const useContactsQuery = () => {
    return useQuery({
        queryKey: ['contacts'],
        queryFn: () => api.contacts.getContacts(),
    });
};

export const useContactMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (contact: Omit<Contact, 'id'>) => api.contacts.createContact(contact),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
        },
    });
};

// Chats
export const useChatsQuery = () => {
    return useQuery({
        queryKey: ['chats'],
        queryFn: () => api.chat.getChats(),
    });
};

export const useMessagesQuery = (chatId: string) => {
    return useQuery({
        queryKey: ['messages', chatId],
        queryFn: () => api.chat.getMessages(chatId),
        enabled: !!chatId,
    });
};

// Campaigns
export const useCampaignsQuery = () => {
    return useQuery({
        queryKey: ['campaigns'],
        queryFn: () => api.campaigns.getCampaigns(),
    });
};

// Templates
export const useTemplatesQuery = () => {
    return useQuery({
        queryKey: ['templates'],
        queryFn: () => api.templates.getTemplates(),
    });
};
