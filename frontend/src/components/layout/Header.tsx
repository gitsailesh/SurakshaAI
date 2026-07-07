// src/components/layout/Header.tsx
"use client"
import { AppBar, Toolbar, Typography, IconButton, Avatar, Box, Chip } from '@mui/material';
import { NotificationsNone, Search } from '@mui/icons-material';

export default function Header() {
    return (
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.default', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <Toolbar>
                {/* Using Box with flex properties instead of Stack to avoid prop-forwarding issues */}
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 500 }}>
                        Nagpur District Administration
                    </Typography>
                    <Chip label="Orange City Health Grid" color="secondary" size="small" variant="outlined" />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                    <IconButton><Search /></IconButton>
                    <IconButton><NotificationsNone /></IconButton>
                    <Avatar sx={{ ml: 2, bgcolor: 'primary.main', width: 32, height: 32 }}>D</Avatar>
                </Box>
            </Toolbar>
        </AppBar>
    );
}