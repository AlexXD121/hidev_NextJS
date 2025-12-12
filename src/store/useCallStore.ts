import { create } from 'zustand';

interface CallState {
    activeCall: {
        type: 'voice' | 'video' | null;
        contactId: string | null;
        contactName: string | null;
        startTime: Date | null;
    };
    startCall: (type: 'voice' | 'video', contactId: string, contactName: string) => void;
    endCall: () => void;
}

export const useCallStore = create<CallState>((set) => ({
    activeCall: {
        type: null,
        contactId: null,
        contactName: null,
        startTime: null
    },
    
    startCall: (type, contactId, contactName) => {
        set({
            activeCall: {
                type,
                contactId,
                contactName,
                startTime: new Date()
            }
        });
    },
    
    endCall: () => {
        set({
            activeCall: {
                type: null,
                contactId: null,
                contactName: null,
                startTime: null
            }
        });
    }
}));