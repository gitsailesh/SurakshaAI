"use client"
import { useState } from 'react';
import { IconButton, CircularProgress, Tooltip } from '@mui/material';
import { Mic, Stop, GraphicEq } from '@mui/icons-material';

export default function VoiceConsole() {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleToggleRecord = async () => {
        if (!isRecording) {
            // Start Web Speech API or MediaRecorder
            setIsRecording(true);
        } else {
            setIsRecording(false);
            setIsProcessing(true);
            // Send audio to Backend: HealthAPI.processVoice(blob)
            setTimeout(() => setIsProcessing(false), 2000); // Simulate processing
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-50">
            <Tooltip title="Voice Report (Hindi/English/Tamil)">
                <IconButton
                    onClick={handleToggleRecord}
                    className={`w-16 h-16 shadow-2xl ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-primary'}`}
                    sx={{ color: 'white' }}
                >
                    {isProcessing ? <CircularProgress size={24} color="inherit" /> : isRecording ? <Stop /> : <Mic />}
                </IconButton>
            </Tooltip>
            {isRecording && <div className="absolute -top-12 right-0 text-white bg-black/50 p-2 rounded text-xs">Listening...</div>}
        </div>
    );
}