// api/chat.js - Simplified version for testing
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, context } = req.body;
    
    // Currently bypassing actual Anthropic API call for testing
    // Just echo back the message to confirm the API route works
    
    // Log that we received a request (will appear in Vercel logs)
    console.log("Received message:", message.substring(0, 50) + "...");
    console.log("Context provided:", context ? "Yes" : "No");
    console.log("Environment variables:", {
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
      hasElevenlabsKey: !!process.env.ELEVENLABS_API_KEY,
      hasVoiceId: !!process.env.ELEVENLABS_VOICE_ID
    });
    
    // Return a simple response for testing
    return res.status(200).json({ 
      response: `I received your message: "${message}". This is a test response from the API endpoint. The actual Claude integration will be activated once we confirm the API route is working properly.`
    });
    
  } catch (error) {
    console.error('Error in chat handler:', error);
    return res.status(500).json({ 
      error: 'Failed to process your request',
      details: error.message 
    });
  }
}
