"use client"
import { Paper, Typography, Box } from '@mui/material';

interface Props {
    title: string;
    value: string;
    trend: string;
    color: 'error' | 'primary' | 'success' | 'warning';
}

export default function RiskSummaryCard({ title, value, trend, color }: Props) {
    return (
        <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>{title}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: `${color}.main` }}>{value}</Typography>
                <Typography variant="caption" color="text.secondary">{trend}</Typography>
            </Box>
        </Paper>
    );
}