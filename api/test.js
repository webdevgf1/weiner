// /api/test.js - Simple test endpoint to check if API routes are working
export default function handler(req, res) {
  return res.status(200).json({ 
    message: "API routes are working!",
    timestamp: new Date().toISOString(),
    env: {
      // Check if environment variables exist (don't expose actual values)
      anthropicKeyExists: !!process.env.ANTHROPIC_API_KEY,
      elevenlabsKeyExists: !!process.env.ELEVENLABS_API_KEY,
      elevenlabsVoiceIdExists: !!process.env.ELEVENLABS_VOICE_ID
    }
  });
}
