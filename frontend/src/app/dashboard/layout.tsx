// src/app/dashboard/layout.tsx
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Box } from '@mui/material';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}