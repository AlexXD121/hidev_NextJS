import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Template } from '@/types';
import { MOCK_TEMPLATES } from '@/lib/mockData';

interface TemplatesState {
    templates: Template[];
    isLoading: boolean;
    searchQuery: string;
    filterCategory: string | null;

    // Actions
    fetchTemplates: () => Promise<void>;
    setSearchQuery: (query: string) => void;
    setFilterCategory: (category: string | null) => void;
    addTemplate: (template: Omit<Template, 'id' | 'status' | 'lastUpdated' | 'usageCount'>) => void;
    updateTemplate: (id: string, updates: Partial<Template>) => void;
}

export const useTemplatesStore = create<TemplatesState>()(
    persist(
        (set, get) => ({
            templates: MOCK_TEMPLATES,
            isLoading: false,
            searchQuery: '',
            filterCategory: null,

            fetchTemplates: async () => {
                set({ isLoading: true });
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500));
                set({ isLoading: false });
            },

            setSearchQuery: (query) => set({ searchQuery: query }),
            setFilterCategory: (category) => set({ filterCategory: category }),

            addTemplate: (templateData) => {
                const newTemplate: Template = {
                    ...templateData,
                    id: `tpl-${Date.now()}`,
                    status: 'pending',
                    lastUpdated: new Date().toISOString(),
                    usageCount: 0
                };
                
                set(state => ({
                    templates: [...state.templates, newTemplate]
                }));
            },

            updateTemplate: (id, updates) => {
                set(state => ({
                    templates: state.templates.map(t => 
                        t.id === id 
                            ? { ...t, ...updates, lastUpdated: new Date().toISOString() }
                            : t
                    )
                }));
            },
        }),
        {
            name: 'templates-storage',
            partialize: (state) => ({
                templates: state.templates
            })
        }
    )
);
