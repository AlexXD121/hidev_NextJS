import { create } from 'zustand';
import { Contact } from '@/types';
import { api } from '@/lib/api/client';

interface ContactsState {
    contacts: Contact[];
    isLoading: boolean;
    filterQuery: string;
    filterTags: string[];

    // Actions
    fetchContacts: () => Promise<void>;
    addContact: (contact: Omit<Contact, 'id'>) => Promise<void>;
    updateContact: (id: string, updates: Partial<Contact>) => Promise<void>;
    deleteContact: (id: string) => Promise<void>;
    setFilterQuery: (query: string) => void;
    setFilterTags: (tags: string[]) => void;
}

export const useContactsStore = create<ContactsState>((set, get) => ({
    contacts: [],
    isLoading: false,
    filterQuery: '',
    filterTags: [],

    fetchContacts: async () => {
        set({ isLoading: true });
        try {
            const contacts = await api.contacts.getContacts();
            set({ contacts, isLoading: false });
        } catch (error) {
            console.error("Failed to fetch contacts", error);
            set({ isLoading: false });
        }
    },

    addContact: async (contact) => {
        set({ isLoading: true });
        try {
            const newContact = await api.contacts.createContact(contact);
            set(state => ({
                contacts: [...state.contacts, newContact],
                isLoading: false
            }));
        } catch (error) {
            console.error("Failed to add contact", error);
            set({ isLoading: false });
        }
    },

    updateContact: async (id, updates) => {
        set({ isLoading: true });
        try {
            const updated = await api.contacts.updateContact(id, updates);
            set(state => ({
                contacts: state.contacts.map(c => c.id === id ? updated : c),
                isLoading: false
            }));
        } catch (error) {
            console.error("Failed to update contact", error);
            set({ isLoading: false });
        }
    },

    deleteContact: async (id) => {
        set({ isLoading: true });
        try {
            await api.contacts.deleteContact(id);
            set(state => ({
                contacts: state.contacts.filter(c => c.id !== id),
                isLoading: false
            }));
        } catch (error) {
            console.error("Failed to delete contact", error);
            set({ isLoading: false });
        }
    },

    setFilterQuery: (query) => set({ filterQuery: query }),
    setFilterTags: (tags) => set({ filterTags: tags }),
}));
