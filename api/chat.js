// api/chat.js - Handles communication with Anthropic's Claude API
import { Anthropic } from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, context } = req.body;
    
    // Log that we received a request (will appear in Vercel logs)
    console.log("Received message:", message.substring(0, 50) + "...");
    
    // Initialize Anthropic client with your API key
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Configure the system prompt with the context
    const systemPrompt = context || "You are Weiner AI, assistant for Weiner Perkins, a satirical fake venture capital firm focused on memecoins. Be humorous and knowledgeable about crypto memes and joke investments.";
    
    // Call Claude API
    const completion = await anthropic.messages.create({
      model: "claude-3-opus-20240229",  // Or your preferred Claude model
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        { role: "user", content: message }
      ]
    });

    // Log successful response (will appear in Vercel logs)
    console.log("Claude responded successfully");
    
    // Return the AI's response
    return res.status(200).json({ 
      response: completion.content[0].text
    });
    
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    return res.status(500).json({ 
      error: 'Failed to process your request',
      details: error.message 
    });
  }
}
