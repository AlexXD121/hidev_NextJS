import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Contact } from '@/types';
import { realApi } from '@/lib/api/real-api';

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

export const useContactsStore = create<ContactsState>()(
    persist(
        (set, get) => ({
            contacts: [],
            isLoading: false,
            filterQuery: '',
            filterTags: [],

            fetchContacts: async () => {
                set({ isLoading: true });
                try {
                    const contacts = await realApi.contacts.getContacts();
                    set({ contacts, isLoading: false });
                } catch (error) {
                    console.error('Failed to fetch contacts:', error);
                    set({ isLoading: false });
                }
            },

            addContact: async (contactData) => {
                try {
                    const newContact = await realApi.contacts.createContact(contactData);
                    set(state => ({
                        contacts: [...state.contacts, newContact]
                    }));
                } catch (error) {
                    console.error('Failed to add contact:', error);
                    // Optionally handle error state
                }
            },

            updateContact: async (id, updates) => {
                try {
                    const updatedContact = await realApi.contacts.updateContact(id, updates);
                    set(state => ({
                        contacts: state.contacts.map(contact =>
                            contact.id === id
                                ? { ...contact, ...updatedContact }
                                : contact
                        )
                    }));
                } catch (error) {
                    console.error('Failed to update contact:', error);
                }
            },

            deleteContact: async (id) => {
                try {
                    await realApi.contacts.deleteContact(id);
                    set(state => ({
                        contacts: state.contacts.filter(contact => contact.id !== id)
                    }));
                } catch (error) {
                    console.error('Failed to delete contact:', error);
                }
            },

            setFilterQuery: (query) => set({ filterQuery: query }),
            setFilterTags: (tags) => set({ filterTags: tags }),
        }),
        {
            name: 'contacts-storage',
            partialize: (state) => ({
                contacts: state.contacts
            })
        }
    )
);
