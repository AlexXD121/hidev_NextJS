import { create } from 'zustand'
import { MOCK_CAMPAIGNS } from '@/lib/mockData'

export interface Campaign {
    id: string
    name: string
    status: 'scheduled' | 'sending' | 'completed' | 'failed' | 'draft'
    sentCount: number
    deliveredCount: number
    readCount: number
    totalContacts: number
    createdAt: string
    templateName?: string
    scheduledDate?: Date
}

interface CampaignStore {
    campaigns: Campaign[]
    addCampaign: (campaign: Campaign) => void
    updateCampaignStatus: (id: string, status: Campaign['status']) => void
    updateCampaignStats: (id: string, stats: Partial<Campaign>) => void
    deleteCampaign: (id: string) => void
    duplicateCampaign: (id: string) => void,
    startSimulation: (id: string) => void
}

export const useCampaignStore = create<CampaignStore>((set, get) => ({
    campaigns: MOCK_CAMPAIGNS as Campaign[],
    addCampaign: (campaign) => set((state) => ({ campaigns: [campaign, ...state.campaigns] })),
    updateCampaignStatus: (id, status) =>
        set((state) => ({
            campaigns: state.campaigns.map((c) => (c.id === id ? { ...c, status } : c)),
        })),
    updateCampaignStats: (id, stats) =>
        set((state) => ({
            campaigns: state.campaigns.map((c) => (c.id === id ? { ...c, ...stats } : c))
        })),
    deleteCampaign: (id) =>
        set((state) => ({
            campaigns: state.campaigns.filter((c) => c.id !== id),
        })),
    duplicateCampaign: (id) =>
        set((state) => {
            const campaignToDuplicate = state.campaigns.find(c => c.id === id)
            if (!campaignToDuplicate) return state

            const newCampaign: Campaign = {
                ...campaignToDuplicate,
                id: crypto.randomUUID(),
                name: `${campaignToDuplicate.name} (Copy)`,
                status: 'draft',
                sentCount: 0,
                deliveredCount: 0,
                readCount: 0,
                createdAt: new Date().toISOString(),
            }
            return { campaigns: [newCampaign, ...state.campaigns] }
        }),
    startSimulation: (id) => {
        const campaign = get().campaigns.find(c => c.id === id)
        if (!campaign || campaign.status === 'completed') return

        // Set to sending
        get().updateCampaignStatus(id, 'sending')

        const interval = setInterval(() => {
            const current = get().campaigns.find(c => c.id === id)
            if (!current || current.status !== 'sending') {
                clearInterval(interval)
                return
            }

            const newSent = Math.min(current.sentCount + Math.floor(Math.random() * 5) + 1, current.totalContacts)
            const newDelivered = Math.min(current.deliveredCount + Math.floor(Math.random() * 4), newSent)
            const newRead = Math.min(current.readCount + Math.floor(Math.random() * 3), newDelivered)

            get().updateCampaignStats(id, {
                sentCount: newSent,
                deliveredCount: newDelivered,
                readCount: newRead
            })

            if (newSent >= current.totalContacts && newDelivered >= current.totalContacts) {
                get().updateCampaignStatus(id, 'completed')
                clearInterval(interval)
            }
        }, 1000)
    }
}))
