"use client"
import { useState } from 'react';
import { Box, Typography, IconButton, Tooltip, Menu, MenuItem, CircularProgress } from '@mui/material';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import VolumeUp from '@mui/icons-material/VolumeUp';
import { HealthAPI } from '@/services/api';

export default function AIInsightsBot({ message }: { message: string }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [translating, setTranslating] = useState(false);

  const handleSpeak = async (lang: string) => {
    let textToSpeak = message;
    setAnchorEl(null);

    if (lang === 'hi' || lang === 'mr') {
      setTranslating(true);
      try {
        const result = await HealthAPI.translateText(message, lang);
        if (result && result.translated_text) {
          textToSpeak = result.translated_text;
        }
      } catch (error) {
        console.error("Translation failed, falling back to English speech", error);
      } finally {
        setTranslating(false);
      }
    }

    const synth = window.speechSynthesis;
    // Cancel any active speech before starting a new one
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Query OS/Browser voices for best matching language voice
    const voices = synth.getVoices();
    let selectedVoice = null;

    if (lang === 'mr') {
      // Find Marathi voice, fallback to Hindi, fallback to default Devanagari
      selectedVoice = voices.find(v => v.lang.toLowerCase().startsWith('mr')) || 
                      voices.find(v => v.lang.toLowerCase().startsWith('hi'));
    } else if (lang === 'hi') {
      selectedVoice = voices.find(v => v.lang.toLowerCase().startsWith('hi'));
    } else {
      selectedVoice = voices.find(v => v.lang.toLowerCase().startsWith('en'));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      // Direct property configuration if matching voice profile was not found
      if (lang === 'hi') utterance.lang = 'hi-IN';
      else if (lang === 'mr') utterance.lang = 'hi-IN'; // Fallback Devanagari voice locale
      else utterance.lang = 'en-IN';
    }

    utterance.rate = 0.9; // Slightly slower for clarity
    synth.speak(utterance);
  };

  return (
    <Box sx={{
      p: 2,
      borderRadius: 3,
      bgcolor: 'rgba(66, 133, 244, 0.08)',
      border: '1px solid rgba(66, 133, 244, 0.2)',
      display: 'flex',
      gap: 2,
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <AutoAwesome color="primary" />
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Nagpur AI Executive Briefing
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
        </Box>
      </Box>

      {/* VOICE CONTROLS */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title={translating ? "Translating briefing..." : "Listen to Briefing"}>
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            disabled={translating || !message || message.includes("Waiting")}
            sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}
          >
            {translating ? (
              <CircularProgress size={20} color="primary" />
            ) : (
              <VolumeUp fontSize="small" color={message.includes("Waiting") ? "disabled" : "primary"} />
            )}
          </IconButton>
        </Tooltip>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => handleSpeak('en')}>English (Nagpur Hub)</MenuItem>
          <MenuItem onClick={() => handleSpeak('hi')}>Hindi (हिंदी)</MenuItem>
          <MenuItem onClick={() => handleSpeak('mr')}>Marathi (मराठी)</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}