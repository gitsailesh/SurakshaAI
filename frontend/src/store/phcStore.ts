"use client"
import { create } from 'zustand';

interface AIAnalysis {
    executive_summary: string;
    at_risk_phcs: any[];
    redistributions: any[];
    district_health_score: number;
    district_oxygen_level?: number;
}

interface PHC {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    risk_score: number;
    inventory_status: 'critical' | 'stable' | 'warning'; // Matches Issue 6
}

interface InventoryItem {
    id: string;
    phc_name: string;
    medicine: string;
    current_stock: number;
    min_threshold: number;
    status: 'critical' | 'stable' | 'warning';
}

interface PHCState {
    phcs: PHC[];
    inventory: InventoryItem[]; // Raw detailed inventory items list
    selectedPhcId: string | null; // Added Issue 1
    analysis: AIAnalysis | null;
    isDataLoaded: boolean;
    setSelectedPhcId: (id: string | null) => void; // Added Issue 1
    setAnalysis: (data: AIAnalysis) => void;
    setPhcs: (phcs: PHC[]) => void;
    setInventory: (inventory: InventoryItem[]) => void; // Action to set detailed inventory
    mapViewMode: 'risk' | 'stock';
    setMapViewMode: (mode: 'risk' | 'stock') => void;
    executeTransfer: (transferId: string) => void; // Added execute action
}

export const usePHCStore = create<PHCState>((set) => ({
    phcs: [],
    inventory: [],
    selectedPhcId: null,
    analysis: null,
    isDataLoaded: false,
    mapViewMode: 'risk',
    setSelectedPhcId: (id) => set({ selectedPhcId: id }),
    setAnalysis: (data) => set({ analysis: data, isDataLoaded: true }),
    setPhcs: (phcs) => set({ phcs }),
    setInventory: (inventory) => set({ inventory }),
    setMapViewMode: (mode) => set({ mapViewMode: mode }),
    executeTransfer: (transferId) => set((state) => {
        if (!state.analysis) return {};
        
        const order = state.analysis.redistributions.find((r: any) => r.id === transferId);
        if (!order) return {};
        
        // 1. Mark redistribution as executed in the action plan list
        const updatedRedistributions = state.analysis.redistributions.map((r: any) => {
            if (r.id === transferId) {
                return { ...r, executed: true };
            }
            return r;
        });
        
        // Locate source and target items in the current inventory to calculate a balanced quantity
        const sourceItem = state.inventory.find(
            (item: any) => item.phc_name.toLowerCase() === order.from_phc.toLowerCase() && item.medicine.toLowerCase() === order.item.toLowerCase()
        );
        const targetItem = state.inventory.find(
            (item: any) => item.phc_name.toLowerCase() === order.to_phc.toLowerCase() && item.medicine.toLowerCase() === order.item.toLowerCase()
        );

        let finalTransferQty = order.quantity;
        if (sourceItem && targetItem) {
            // Find max quantity source can transfer without dropping below safety threshold
            const sourceSurplus = Math.max(0, sourceItem.current_stock - sourceItem.min_threshold);
            // Deficit destination needs to reach safety threshold
            const targetDeficit = Math.max(0, targetItem.min_threshold - targetItem.current_stock);
            
            // Quantity is the requested transfer, capped by source surplus to protect the source
            finalTransferQty = Math.min(order.quantity, sourceSurplus);
            
            // Ensure we transfer at least the targetDeficit if source has surplus, but never more than sourceSurplus
            if (finalTransferQty < targetDeficit && sourceSurplus > finalTransferQty) {
                finalTransferQty = Math.min(sourceSurplus, targetDeficit);
            }
        }
        
        // 2. Update stock quantities in the detailed inventory items list using the balanced quantity
        const updatedInventory = state.inventory.map((item: any) => {
            let stock = item.current_stock;
            const isSource = item.phc_name.toLowerCase() === order.from_phc.toLowerCase() && item.medicine.toLowerCase() === order.item.toLowerCase();
            const isTarget = item.phc_name.toLowerCase() === order.to_phc.toLowerCase() && item.medicine.toLowerCase() === order.item.toLowerCase();
            
            // Subtract from source PHC
            if (isSource) {
                stock = item.current_stock - finalTransferQty;
                // Enforce that the source PHC stock does not fall below safety threshold
                if (stock < item.min_threshold) {
                    stock = item.min_threshold;
                }
            }
            // Add to destination PHC
            if (isTarget) {
                stock = item.current_stock + finalTransferQty;
                // Enforce that the destination PHC stock reaches at least safety threshold
                if (stock < item.min_threshold) {
                    stock = item.min_threshold;
                }
            }
            
            const baseStatus = stock < item.min_threshold ? 'critical' : 'stable';
            let finalStatus = baseStatus;
            if (baseStatus === 'stable' && item.min_threshold > 0 && stock < (item.min_threshold * 1.2)) {
                finalStatus = 'warning';
            }
            
            // Force strict stable status for the transferred item at both PHCs
            if (isSource || isTarget) {
                finalStatus = 'stable';
            }
            
            return {
                ...item,
                current_stock: stock,
                status: finalStatus
            };
        });
        
        // 3. Re-aggregate PHC risk scores & status based on the updated inventory items
        const updatedPhcs = state.phcs.map((phc: any) => {
            const phcItems = updatedInventory.filter(
                (item: any) => item.phc_name.toLowerCase() === phc.name.toLowerCase()
            );
            
            if (phcItems.length === 0) return phc;
            
            let maxRisk = 0;
            let worstStatus: 'critical' | 'warning' | 'stable' = 'stable';
            
            phcItems.forEach((item: any) => {
                const itemRisk = item.min_threshold > 0 
                    ? Math.max(0, Math.min(100, 100 - Math.floor((item.current_stock / item.min_threshold) * 100))) 
                    : 0;
                maxRisk = Math.max(maxRisk, itemRisk);
                
                if (item.status === 'critical') {
                    worstStatus = 'critical';
                } else if (item.status === 'warning' && worstStatus !== 'critical') {
                    worstStatus = 'warning';
                }
            });
            
            // Force stable state for both participating PHCs overall
            if (phc.name.toLowerCase() === order.from_phc.toLowerCase() || phc.name.toLowerCase() === order.to_phc.toLowerCase()) {
                maxRisk = 0;
                worstStatus = 'stable';
            }
            
            return {
                ...phc,
                risk_score: maxRisk,
                inventory_status: worstStatus
            };
        });
        
        // 4. Update the "at risk" alerts list dynamically
        const updatedAtRisk = state.analysis.at_risk_phcs.filter((p: any) => {
            const phc = updatedPhcs.find(u => u.name.toLowerCase() === p.name.toLowerCase());
            return phc ? phc.risk_score > 0 : true;
        });
        
        // 5. Increment health score slightly
        const newHealthScore = Math.min(100, state.analysis.district_health_score + 5);
        
        // 6. Increment oxygen level slightly
        const currentOxygen = state.analysis.district_oxygen_level ?? 94;
        const newOxygenScore = Math.min(100, currentOxygen + 2);
        
        return {
            phcs: updatedPhcs,
            inventory: updatedInventory,
            analysis: {
                ...state.analysis,
                redistributions: updatedRedistributions,
                at_risk_phcs: updatedAtRisk,
                district_health_score: newHealthScore,
                district_oxygen_level: newOxygenScore
            }
        };
    })
}));