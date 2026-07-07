"use client"
import React, { useState } from 'react';
import {
    APIProvider,
    Map,
    AdvancedMarker,
    Pin,
    InfoWindow
} from '@vis.gl/react-google-maps';
import { usePHCStore } from '@/store/phcStore';
import { Box, Typography, Paper, Chip } from '@mui/material';

const NAGPUR_CENTER = { lat: 21.1458, lng: 79.0882 };

export function MapContainer() {
    // 1. Unified Store Access
    const { phcs, selectedPhcId, setSelectedPhcId, mapViewMode } = usePHCStore();
    const [infoWindowOpen, setInfoWindowOpen] = useState(false);

    const selectedPhc = phcs.find(p => p.id === selectedPhcId);

    // 2. Dynamic Color Logic based on User Toggle
    const getPinAttributes = (phc: any) => {
        if (mapViewMode === 'risk') {
            // RISK MODE: Standard Red/Yellow/Green based on AI Risk Score
            if (phc.risk_score > 80) return { color: '#EA4335', scale: 1.2 };
            if (phc.risk_score > 50) return { color: '#FBBC04', scale: 1.0 };
            return { color: '#34A853', scale: 0.9 };
        } else {
            // STOCK MODE: Red (Critical Shortage), Orange (Warning), Blue (Optimal)
            const status = phc.inventory_status || 'stable';
            if (status === 'critical') return { color: '#EA4335', scale: 1.2 };
            if (status === 'warning') return { color: '#FF6D00', scale: 1.1 };
            return { color: '#4285F4', scale: 1.0 }; // Google Blue for Stable Supply
        }
    };

    const MAP_ID = process.env.NEXT_PUBLIC_MAP_ID || "DEMO_MAP_ID";

    return (
        <Box sx={{ width: '100%', height: '100%', bgcolor: '#0B0E11' }}>
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ""}>
                <Map
                    style={{ width: '100%', height: '100%' }}
                    defaultCenter={NAGPUR_CENTER}
                    defaultZoom={11}
                    mapId={MAP_ID}
                    disableDefaultUI={true}
                    gestureHandling={'greedy'}
                    colorScheme={'DARK'}
                >
                    {phcs.map((phc) => {
                        const { color, scale } = getPinAttributes(phc);

                        return (
                            <AdvancedMarker
                                key={phc.id}
                                position={{ lat: phc.latitude, lng: phc.longitude }}
                                onClick={() => {
                                    setSelectedPhcId(phc.id);
                                    setInfoWindowOpen(true);
                                }}
                            >
                                <Pin
                                    background={color}
                                    glyphColor={'#fff'}
                                    borderColor={'#fff'}
                                    scale={scale}
                                />
                            </AdvancedMarker>
                        );
                    })}

                    {infoWindowOpen && selectedPhc && (
                        <InfoWindow
                            position={{ lat: selectedPhc.latitude, lng: selectedPhc.longitude }}
                            onCloseClick={() => setInfoWindowOpen(false)}
                        >
                            <Paper sx={{
                                p: 1.5,
                                bgcolor: '#15191C',
                                color: 'white',
                                borderRadius: 2,
                                border: '1px solid rgba(255,255,255,0.1)',
                                minWidth: 150
                            }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                    {selectedPhc.name}
                                </Typography>
                                <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.6)' }}>
                                    {mapViewMode === 'risk' ? `Risk Score: ${selectedPhc.risk_score}%` : 'Stock Status Verified'}
                                </Typography>

                                {(() => {
                                    const status = selectedPhc.inventory_status ||
                                        (selectedPhc.risk_score > 80 ? 'critical' : selectedPhc.risk_score > 50 ? 'warning' : 'stable');

                                    return (
                                        <Chip
                                            size="small"
                                            label={status.toUpperCase()}
                                            color={status === 'critical' ? 'error' : (status === 'warning' ? 'warning' : 'success')}
                                            sx={{
                                                mt: 1,
                                                height: 22,
                                                fontSize: '0.65rem',
                                                fontWeight: 'bold'
                                            }}
                                        />
                                    );
                                })()}
                            </Paper>
                        </InfoWindow>
                    )}
                </Map>
            </APIProvider>
        </Box>
    );
}