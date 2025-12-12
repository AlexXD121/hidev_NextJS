import { create } from 'zustand';
import { Template } from '@/types';
import { api } from '@/lib/api/client';

interface TemplatesState {
    templates: Template[];
    isLoading: boolean;
    searchQuery: string;
    filterCategory: string | null;

    // Actions
    fetchTemplates: () => Promise<void>;
    setSearchQuery: (query: string) => void;
    setFilterCategory: (category: string | null) => void;
    addTemplate: (template: Omit<Template, 'id' | 'status' | 'lastUpdated' | 'usageCount'>) => Promise<void>;
    updateTemplate: (id: string, updates: Partial<Template>) => Promise<void>;
}

export const useTemplatesStore = create<TemplatesState>((set, get) => ({
    templates: [],
    isLoading: false,
    searchQuery: '',
    filterCategory: null,

    fetchTemplates: async () => {
        set({ isLoading: true });
        try {
            const templates = await api.templates.getTemplates();
            set({ templates, isLoading: false });
        } catch (error) {
            console.error("Failed to fetch templates", error);
            set({ isLoading: false });
        }
    },

    setSearchQuery: (query) => set({ searchQuery: query }),
    setFilterCategory: (category) => set({ filterCategory: category }),

    addTemplate: async (template) => {
        set({ isLoading: true });
        try {
            const newTemplate = await api.templates.createTemplate(template);
            set(state => ({
                templates: [...state.templates, newTemplate],
                isLoading: false
            }));
        } catch (error) {
            console.error("Failed to add template", error);
            set({ isLoading: false });
        }
    },

    updateTemplate: async (id, updates) => {
        set({ isLoading: true });
        try {
            const updated = await api.templates.updateTemplate(id, updates);
            set(state => ({
                templates: state.templates.map(t => t.id === id ? updated : t),
                isLoading: false
            }));
        } catch (error) {
            console.error("Failed to update template", error);
            set({ isLoading: false });
        }
    },
}));
