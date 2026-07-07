import { create } from 'zustand';

interface HealthState {
    selectedPhcId: string | null;
    districtsAlerts: any[];
    mapCenter: { lat: number; lng: number };
    setSelectedPhc: (id: string) => void;
    setAlerts: (alerts: any[]) => void;
}

export const useHealthStore = create<HealthState>((set) => ({
    selectedPhcId: null,
    districtsAlerts: [],
    mapCenter: { lat: 18.5204, lng: 73.8567 }, // Default Pune
    setSelectedPhc: (id) => set({ selectedPhcId: id }),
    setAlerts: (alerts) => set({ districtsAlerts: alerts }),
}));