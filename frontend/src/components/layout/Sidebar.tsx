"use client"
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { Dashboard, LocalHospital, Inventory, Notifications, Map as MapIcon, Settings } from '@mui/icons-material';
import Link from 'next/link';

const menuItems = [
    { text: 'Situation Room', icon: <Dashboard />, href: '/dashboard' },
    { text: 'Map View', icon: <MapIcon />, href: '/dashboard/map' },
    { text: 'Inventory', icon: <Inventory />, href: '/dashboard/inventory' },
    { text: 'PHC Alerts', icon: <Notifications />, href: '/dashboard/alerts' },
];

export default function Sidebar() {
    return (
        <Box sx={{ width: 260, height: '100vh', bgcolor: 'background.paper', borderRight: '1px solid rgba(255,255,255,0.1)', p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, px: 1 }}>
                <LocalHospital color="primary" fontSize="large" />
                <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>SURAKSHA AI</Typography>
            </Box>

            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                        <Link href={item.href} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                            <ListItemButton sx={{ borderRadius: 2 }}>
                                <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ))}
            </List>
            <Divider sx={{ my: 2 }} />
        </Box>
    );
}