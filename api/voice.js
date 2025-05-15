// api/voice.js - Simplified version for testing
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;
    
    // Log that we received a request (will appear in Vercel logs)
    console.log("Received text for voice synthesis:", text.substring(0, 50) + "...");
    console.log("Environment variables:", {
      hasElevenlabsKey: !!process.env.ELEVENLABS_API_KEY,
      hasVoiceId: !!process.env.ELEVENLABS_VOICE_ID
    });
    
    // Instead of calling Eleven Labs API, we're returning a simple
    // text response to confirm the endpoint is working
    
    // For testing, we'll respond with text rather than audio
    // When you confirm the API route is working, replace this with
    // actual Eleven Labs integration
    
    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send(
      "Voice API endpoint is working. This would normally return audio."
    );
    
  } catch (error) {
    console.error('Error in voice handler:', error);
    return res.status(500).json({ 
      error: 'Failed to generate speech',
      details: error.message 
    });
  }
}
