const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://suraksha-backend-954467952432.asia-south1.run.app';

export const HealthAPI = {
  // Upload CSV/Excel Data
  uploadData: async (districtId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/api/v1/data/upload/${districtId}`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  // Get AI Analysis
  getDistrictIntelligence: async (districtId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/analysis/district/${districtId}`);
    if (!response.ok) throw new Error('AI Analysis failed');
    return response.json();
  },

  // Approve Redistribution (UUID based)
  approveTransfer: async (transferId: string) => {
    return fetch(`${API_BASE_URL}/api/v1/inventory/transfer/${transferId}/approve`, {
      method: 'POST',
    });
  },

  // Translate text via Gemini
  translateText: async (text: string, targetLang: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/analysis/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, target_lang: targetLang }),
    });
    if (!response.ok) throw new Error('Translation failed');
    return response.json();
  }
};