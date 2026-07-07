# 1. Create the specific SurakshaAI component directories
mkdir -p src/components/maps src/components/ai src/components/layout src/hooks

# 2. Re-inject the AI Insights Component
cat <<EOF > src/components/ai/AIInsightsBot.tsx
"use client"
import { Paper, Typography, Box } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';

export default function AIInsightsBot() {
  return (
    <Box className="p-4 flex gap-3 items-start">
      <AutoAwesome color="primary" />
      <div>
        <Typography variant="subtitle2" fontWeight="bold">Gemini Intelligence</Typography>
        <Typography variant="body2" color="text.secondary">
          Analyzing district patterns... 3 PHCs show high risk of stock-out in 48 hours.
        </Typography>
      </div>
    </Box>
  );
}
EOF
