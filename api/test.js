// api/test.js
export default function handler(req, res) {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Return basic info about API status and environment variables
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
