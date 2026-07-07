"use client"
import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import ErrorOutlined from '@mui/icons-material/ErrorOutlined';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlined from '@mui/icons-material/WarningAmberOutlined';

const alerts = [
    { id: 1, title: 'Critical Shortage: Insulin', phc: 'Kalmeshwar', time: '14 hours remaining', priority: 'high' },
    { id: 2, title: 'Inflow Surge: Fever Cases', phc: 'Kamptee', time: 'Started 3 hours ago', priority: 'medium' },
    { id: 3, title: 'Redistribution Required: ORS', phc: 'Hingna to Ramtek', time: 'System Suggestion', priority: 'low' },
];

export default function AlertsPage() {
    return (
        <Box sx={{ p: 2, maxWidth: 900 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Intelligence Alerts</Typography>
                <Typography variant="body2" color="text.secondary">Nagpur District Emergency Directives</Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {alerts.map((alert) => (
                    <Paper
                        key={alert.id}
                        elevation={0}
                        sx={{
                            p: 2,
                            border: '1px solid rgba(255,255,255,0.1)',
                            bgcolor: 'background.paper',
                            borderRadius: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'transform 0.2s',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.03)', transform: 'translateY(-2px)' }
                        }}
                    >
                        {/* LEFT: ICON AND TEXT */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                            <Box>
                                {alert.priority === 'high' ? (
                                    <ErrorOutlined sx={{ color: 'error.main', fontSize: 28 }} />
                                ) : alert.priority === 'medium' ? (
                                    <WarningAmberOutlined sx={{ color: 'warning.main', fontSize: 28 }} />
                                ) : (
                                    <InfoOutlined sx={{ color: 'primary.main', fontSize: 28 }} />
                                )}
                            </Box>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{alert.title}</Typography>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{alert.phc}</Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>•</Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{alert.time}</Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* RIGHT: CHIP AND BUTTON (NO OVERLAP) */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
                            <Chip
                                label={alert.priority.toUpperCase()}
                                size="small"
                                sx={{
                                    fontWeight: 'bold',
                                    fontSize: '0.65rem',
                                    bgcolor: alert.priority === 'high' ? 'rgba(234, 67, 53, 0.1)' : 'rgba(255,255,255,0.05)',
                                    color: alert.priority === 'high' ? 'error.main' : 'text.primary',
                                    border: alert.priority === 'high' ? '1px solid rgba(234, 67, 53, 0.2)' : '1px solid rgba(255,255,255,0.1)'
                                }}
                            />
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    px: 2,
                                    whiteSpace: 'nowrap' // Prevents "Take Action" from wrapping
                                }}
                            >
                                Take Action
                            </Button>
                        </Box>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
}