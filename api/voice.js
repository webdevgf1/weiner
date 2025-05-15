// api/voice.js - Handles communication with Eleven Labs API
import axios from 'axios';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;
    
    // Log incoming request
    console.log("Processing voice request for text:", text.substring(0, 50) + "...");
    
    // ElevenLabs API endpoint
    const apiUrl = 'https://api.elevenlabs.io/v1/text-to-speech/';
    
    // Get voice ID from environment variables or use a default one
    const voiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';
    
    console.log("Using voice ID:", voiceId);
    
    // Make request to Eleven Labs API
    const response = await axios({
      method: 'POST',
      url: `${apiUrl}${voiceId}`,
      data: {
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY
      },
      responseType: 'arraybuffer'
    });

    console.log("Received voice data from Eleven Labs, size:", response.data.length);
    
    // Set appropriate headers for audio response
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-cache');
    
    // Return the audio data
    return res.status(200).send(Buffer.from(response.data));
    
  } catch (error) {
    console.error('Error calling Eleven Labs API:', error);
    return res.status(500).json({ 
      error: 'Failed to generate speech',
      details: error.message 
    });
  }
}
