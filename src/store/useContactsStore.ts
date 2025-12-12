import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Contact } from '@/types';
import { MOCK_CONTACTS } from '@/lib/mockData';

interface ContactsState {
    contacts: Contact[];
    isLoading: boolean;
    filterQuery: string;
    filterTags: string[];

    // Actions
    fetchContacts: () => Promise<void>;
    addContact: (contact: Omit<Contact, 'id'>) => void;
    updateContact: (id: string, updates: Partial<Contact>) => void;
    deleteContact: (id: string) => void;
    setFilterQuery: (query: string) => void;
    setFilterTags: (tags: string[]) => void;
}

export const useContactsStore = create<ContactsState>()(
    persist(
        (set, get) => ({
            contacts: MOCK_CONTACTS,
            isLoading: false,
            filterQuery: '',
            filterTags: [],

            fetchContacts: async () => {
                set({ isLoading: true });
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500));
                set({ isLoading: false });
            },

            addContact: (contactData) => {
                const newContact: Contact = {
                    ...contactData,
                    id: `contact-${Date.now()}`,
                    lastActive: new Date().toISOString(),
                };
                
                set(state => ({
                    contacts: [...state.contacts, newContact]
                }));
            },

            updateContact: (id, updates) => {
                set(state => ({
                    contacts: state.contacts.map(contact =>
                        contact.id === id 
                            ? { ...contact, ...updates }
                            : contact
                    )
                }));
            },

            deleteContact: (id) => {
                set(state => ({
                    contacts: state.contacts.filter(contact => contact.id !== id)
                }));
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
