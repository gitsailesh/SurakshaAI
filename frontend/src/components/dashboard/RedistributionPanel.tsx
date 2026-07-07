// src/components/dashboard/RedistributionPanel.tsx
"use client"
import React, { useState } from 'react';
import { Paper, Typography, Box, Button, CircularProgress } from '@mui/material';
import CheckCircle from '@mui/icons-material/CheckCircle';
import LocalShipping from '@mui/icons-material/LocalShipping';
import { usePHCStore } from '@/store/phcStore';
import { HealthAPI } from '@/services/api';

export default function RedistributionPanel({ data }: { data: any[] }) {
    const { executeTransfer } = usePHCStore();
    const [loadingMap, setLoadingMap] = useState<{ [key: string]: boolean }>({});

    const handleExecute = async (move: any) => {
        const id = move.id;
        if (!id) return;

        setLoadingMap(prev => ({ ...prev, [id]: true }));
        try {
            const response = await HealthAPI.approveTransfer(id);
            if (response.ok) {
                executeTransfer(id);
            } else {
                console.error("Failed to approve transfer:", response.statusText);
            }
        } catch (error) {
            console.error("Error executing transfer:", error);
        } finally {
            setLoadingMap(prev => ({ ...prev, [id]: false }));
        }
    };

    return (
        <Paper sx={{ p: 3, height: '500px', overflowY: 'auto', borderRadius: 3, bgcolor: '#0B0E11', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>AI Action Plan</Typography>
            {data.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Upload data to see redistribution orders.
                </Typography>
            ) : (
                data.map((move, i) => {
                    const isExecuting = loadingMap[move.id] || false;
                    const isExecuted = move.executed || false;

                    return (
                        <Box 
                            key={move.id || i} 
                            sx={{ 
                                p: 2, 
                                mb: 2, 
                                bgcolor: isExecuted ? 'rgba(52, 168, 83, 0.05)' : 'rgba(66, 133, 244, 0.05)', 
                                borderRadius: 2, 
                                border: isExecuted ? '1px solid rgba(52, 168, 83, 0.15)' : '1px solid rgba(66, 133, 244, 0.15)',
                                mt: 2,
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: isExecuted ? '#34A853' : 'text.primary' }}>
                                    Move {move.item}
                                </Typography>
                                {isExecuted && <CheckCircle sx={{ color: '#34A853', fontSize: 18 }} />}
                            </Box>
                            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 500 }}>
                                {move.from_phc} ➔ {move.to_phc}
                            </Typography>
                            <Typography variant="body2" sx={{ my: 1, fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>
                                {move.reasoning}
                            </Typography>
                            
                            <Button 
                                variant={isExecuted ? "outlined" : "contained"} 
                                size="small" 
                                fullWidth
                                color={isExecuted ? "success" : "primary"}
                                disabled={isExecuting || isExecuted}
                                onClick={() => handleExecute(move)}
                                startIcon={isExecuting ? <CircularProgress size={16} color="inherit" /> : (isExecuted ? <CheckCircle /> : <LocalShipping />)}
                                sx={{
                                    mt: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        transform: (isExecuting || isExecuted) ? 'none' : 'translateY(-1px)'
                                    }
                                }}
                            >
                                {isExecuting ? "Transferring..." : (isExecuted ? "Transfer Executed" : "Execute Transfer")}
                            </Button>
                        </Box>
                    );
                })
            )}
        </Paper>
    );
}