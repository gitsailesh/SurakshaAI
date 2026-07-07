"use client"
import { useState, useEffect } from 'react'; // Added hooks
import { Box, Typography, Paper } from '@mui/material';
import { usePHCStore } from '@/store/phcStore';
import { MapContainer } from '@/components/maps/MapContainer';
import RiskSummaryCard from '@/components/dashboard/RiskSummaryCard';
import RedistributionPanel from '@/components/dashboard/RedistributionPanel';
import AIInsightsBot from '@/components/ai/AIInsightsBot';

export default function SituationRoom() {
    const { analysis, isDataLoaded } = usePHCStore();

    // --- HYDRATION FIX & LIVE CLOCK LOGIC ---
    const [time, setTime] = useState<string>("");

    useEffect(() => {
        // Set initial time on mount
        setTime(new Date().toLocaleTimeString());

        // Update time every second for the "Live" effect
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);

        return () => clearInterval(timer);
    }, []);
    // ----------------------------------------

    const stats = {
        riskCount: isDataLoaded ? (analysis?.at_risk_phcs?.length || 0).toString() : "0",
        healthScore: isDataLoaded ? `${analysis?.district_health_score || 0}%` : "0%",
        movesCount: isDataLoaded ? (analysis?.redistributions?.filter((r: any) => !r.executed)?.length || 0).toString() : "0",
        oxygenLevel: isDataLoaded ? `${analysis?.district_oxygen_level || 94}%` : "0%",
        summary: isDataLoaded
            ? (analysis?.executive_summary || "")
            : "Awaiting Nagpur District data upload to generate strategic intelligence..."
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 1 }}>

            {/* 1. HEADER SECTION */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
                        Nagpur Situation Room
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Health Intelligence Orchestration • District Nagpur Hub
                    </Typography>
                </Box>
                <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                        <Box sx={{
                            width: 10, height: 10,
                            bgcolor: isDataLoaded ? '#34A853' : '#FBBC04',
                            borderRadius: '50%',
                            boxShadow: isDataLoaded ? '0 0 10px #34A853' : 'none'
                        }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: isDataLoaded ? '#34A853' : '#FBBC04' }}>
                            {isDataLoaded ? "LIVE INTELLIGENCE ACTIVE" : "AWAITING DATA SYNC"}
                        </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', minWidth: '100px', display: 'inline-block' }}>
                        {/* The time now only displays after mounting, fixing the error */}
                        Nagpur Standard Time: {time || "Loading..."}
                    </Typography>
                </Box>
            </Box>

            {/* 2. KPI ROW */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
                gap: 3
            }}>
                <RiskSummaryCard title="PHCs at Risk" value={stats.riskCount} trend="AI Verified" color="error" />
                <RiskSummaryCard title="District Health Score" value={stats.healthScore} trend="Calculated Index" color="primary" />
                <RiskSummaryCard title="Optimization Moves" value={stats.movesCount} trend="Pending Approval" color="success" />
                <RiskSummaryCard title="Oxygen Level" value={stats.oxygenLevel} trend="District Avg" color={parseInt(stats.oxygenLevel) < 80 ? "warning" : "primary"} />
            </Box>

            {/* 3. MAIN CONTENT AREA */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
                gap: 3,
                minHeight: '520px'
            }}>
                <Paper sx={{ p: 0, position: 'relative', overflow: 'hidden', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)', bgcolor: '#0B0E11' }}>
                    <MapContainer />
                </Paper>
                <Box>
                    <RedistributionPanel data={analysis?.redistributions || []} />
                </Box>
            </Box>

            {/* 4. AI EXECUTIVE BRIEFING FOOTER */}
            <Box sx={{ mt: 1 }}>
                <AIInsightsBot message={stats.summary} />
            </Box>
        </Box>
    );
}