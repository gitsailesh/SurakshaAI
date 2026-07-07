// src/app/dashboard/map/page.tsx
"use client"
import { Box, Paper, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { MapContainer } from '@/components/maps/MapContainer';
import { usePHCStore } from '@/store/phcStore';

import LocalPharmacy from '@mui/icons-material/LocalPharmacy';
import Warning from '@mui/icons-material/Warning';

export default function MapPage() {
    const { mapViewMode, setMapViewMode } = usePHCStore();

    return (
        <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Geospatial Intelligence</Typography>
                <ToggleButtonGroup 
                    size="small" 
                    color="primary" 
                    value={mapViewMode}
                    exclusive
                    onChange={(e, newMode) => {
                        if (newMode) setMapViewMode(newMode);
                    }}
                >
                    <ToggleButton value="risk"><Warning sx={{ mr: 1 }} /> Risk Heatmap</ToggleButton>
                    <ToggleButton value="stock"><LocalPharmacy sx={{ mr: 1 }} /> Stock Levels</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Paper sx={{ flexGrow: 1, borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <MapContainer />
            </Paper>
        </Box>
    );
}