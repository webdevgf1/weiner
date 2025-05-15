// api/chat.js - Handles communication with Anthropic's Claude API
// Simple version without external dependencies

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, context } = req.body;
    
    // Log that we received a request (will appear in Vercel logs)
    console.log("Received message:", message.substring(0, 50) + "...");
    
    // API endpoint for Claude
    const apiUrl = 'https://api.anthropic.com/v1/messages';
    
    // Configure the system prompt with the context
    const systemPrompt = context || "You are Weiner AI, assistant for Weiner Perkins, a satirical fake venture capital firm focused on memecoins. Be humorous and knowledgeable about crypto memes and joke investments.";
    
    // Prepare request body for Anthropic API
    const requestBody = {
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        { role: "user", content: message }
      ]
    };
    
    // Call Anthropic API using native fetch
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Anthropic API error: ${response.status} ${errorData}`);
    }
    
    const data = await response.json();
    const aiResponse = data.content[0].text;
    
    // Log successful response (will appear in Vercel logs)
    console.log("Claude responded successfully");
    
    // Return the AI's response
    return res.status(200).json({ 
      response: aiResponse
    });
    
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    return res.status(500).json({ 
      error: 'Failed to process your request',
      details: error.message 
    });
  }
}
