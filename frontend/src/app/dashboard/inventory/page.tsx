"use client"
import { useState } from 'react';
import { Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, LinearProgress, Chip, Alert, Stack } from '@mui/material';
import CloudUpload from '@mui/icons-material/CloudUpload';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import CameraAlt from '@mui/icons-material/CameraAlt';
import Download from '@mui/icons-material/Download';
import { usePHCStore } from '@/store/phcStore';

export default function InventoryPage() {
    const [uploading, setUploading] = useState(false);
    const [visionData, setVisionData] = useState<any[] | null>(null);
    const { setAnalysis, setPhcs, setInventory, inventory, analysis, isDataLoaded } = usePHCStore();

    // API URL from env or default
    const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/inventory`;

    // --- LOGIC 1: STRATEGIC CSV UPLOAD ---
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_BASE}/upload-district-report`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            setAnalysis(result.analysis);
            setPhcs(result.phcs);
            setInventory(result.inventory);
            setVisionData(null); // Clear vision data if showing CSV
        } catch (error) {
            console.error("CSV Upload failed", error);
        } finally {
            setUploading(false);
        }
    };

    // --- LOGIC 2: CAMERA / VISION UPLOAD ---
    const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        // Using a placeholder UUID for a Nagpur PHC for the demo
        const demoPhcId = "550e8400-e29b-41d4-a716-446655440000";

        try {
            const response = await fetch(`${API_BASE}/${demoPhcId}/upload-inventory-photo`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            // result.detected_inventory is the list from Gemini Vision
            setVisionData(result.detected_inventory);
            // Clear CSV analysis if showing Vision
            usePHCStore.setState({ isDataLoaded: false, analysis: null, phcs: [], inventory: [] });
        } catch (error) {
            console.error("Vision Upload failed", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Nagpur Inventory Intelligence</Typography>

            <Paper sx={{ p: 4, textAlign: 'center', border: '2px dashed rgba(255,255,255,0.1)', bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 4 }}>
                {!uploading && !isDataLoaded && !visionData && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                        <CloudUpload sx={{ fontSize: 48, color: 'primary.main' }} />
                        <Typography variant="h6">Update Nagpur Health Data</Typography>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <Button variant="contained" component="label" startIcon={<AutoAwesome />}>
                                Analyze District CSV
                                <input type="file" hidden onChange={handleFileUpload} accept=".csv" />
                            </Button>

                            <Button variant="outlined" component="label" startIcon={<CameraAlt />}>
                                Scan Shelf Photo
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    capture="environment"
                                    onChange={handlePhotoUpload}
                                />
                            </Button>
                        </Stack>
                        
                        <Button 
                            variant="text" 
                            href="/sample_nagpur_inventory.csv" 
                            download="sample_nagpur_inventory.csv"
                            startIcon={<Download />}
                            size="small"
                            sx={{ color: 'primary.light', textTransform: 'none', fontWeight: 600 }}
                        >
                            Download Sample District CSV Template
                        </Button>

                        <Typography variant="caption" color="text.secondary">
                            Supports National Health Mission spreadsheets or real-time shelf photography.
                        </Typography>
                    </Box>
                )}

                {uploading && (
                    <Box sx={{ py: 4 }}>
                        <Typography variant="h6" gutterBottom>Gemini AI is processing multimodal input...</Typography>
                        <LinearProgress color="secondary" sx={{ borderRadius: 2, height: 8 }} />
                    </Box>
                )}

                {/* DISPLAY AI REDISTRIBUTION RESULTS (CSV) */}
                {isDataLoaded && analysis && (
                    <Box sx={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Alert icon={<AutoAwesome />} severity="info" sx={{ borderRadius: 2 }}>
                            {analysis.executive_summary}
                        </Alert>

                        <Box>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>AI Action Plan: Nagpur District</Typography>
                            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                                <Table size="small">
                                    <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Source</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Destination</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Item</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Qty</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>AI Reasoning</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {analysis.redistributions.map((row: any, i: number) => (
                                            <TableRow key={row.id || i} hover>
                                                <TableCell>{row.from_phc}</TableCell>
                                                <TableCell>{row.to_phc}</TableCell>
                                                <TableCell>{row.item}</TableCell>
                                                <TableCell><b>{row.quantity}</b></TableCell>
                                                <TableCell sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{row.reasoning}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        <Box>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Nagpur District Current Inventory</Typography>
                            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                                <Table size="small">
                                    <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold' }}>PHC Name</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Medicine/Item</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Current Stock</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Safety Threshold</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {inventory.map((row: any) => (
                                            <TableRow key={row.id} hover>
                                                <TableCell>{row.phc_name}</TableCell>
                                                <TableCell>{row.medicine}</TableCell>
                                                <TableCell><b>{row.current_stock}</b></TableCell>
                                                <TableCell>{row.min_threshold}</TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        size="small" 
                                                        label={row.status.toUpperCase()} 
                                                        color={row.status === 'critical' ? 'error' : (row.status === 'warning' ? 'warning' : 'success')}
                                                        sx={{ fontWeight: 'bold', fontSize: '0.65rem', height: 20 }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        <Box>
                            <Button variant="outlined" onClick={() => usePHCStore.setState({ isDataLoaded: false, analysis: null, phcs: [], inventory: [] })}>New Upload</Button>
                        </Box>
                    </Box>
                )}

                {/* DISPLAY VISION RESULTS (PHOTO) */}
                {visionData && (
                    <Box sx={{ textAlign: 'left' }}>
                        <Alert icon={<CheckCircleOutlined />} severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                            Gemini Vision: Computer-vision stock detection complete.
                        </Alert>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Detected Items on Shelf</Typography>
                        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                            <Table size="small">
                                <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Medicine Detected</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Est. Quantity</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>AI Confidence</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {visionData.map((item: any, i: number) => (
                                        <TableRow key={i} hover>
                                            <TableCell>{item.item_name}</TableCell>
                                            <TableCell>{item.detected_quantity}</TableCell>
                                            <TableCell>
                                                <Chip size="small" label={`${Math.round(item.confidence * 100)}%`} variant="outlined" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Button sx={{ mt: 3 }} onClick={() => setVisionData(null)}>Capture Another</Button>
                    </Box>
                )}
            </Paper>
        </Box>
    );
}