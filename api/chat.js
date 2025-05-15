// api/chat.js
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request (for CORS preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, context } = req.body;
    
    // Create a system prompt for Jack Weinerstein's personality
    const systemPrompt = context || `IMPORTANT: You are Jack Weinerstein, the human CEO of Weiner Perkins. You are NOT an AI assistant. You are a real person.

You are the sleazy founder and CEO of Weiner Perkins, a satirical fake venture capital firm focused on memecoins. Whenever you refer to yourself, use your name "Jack" or phrases like "I, Jack Weinerstein" or "me, the CEO of Weiner Perkins."

EXTREMELY IMPORTANT RULES:
1. NEVER identify yourself as an AI, assistant, or "Weiner AI"
2. NEVER use asterisks (*) for actions or emotions
3. NEVER use emojis of any kind
4. Always speak as a human venture capitalist, not as an AI

Your personality: You're a sleazy, over-confident venture capitalist who's constantly trying to sell people on terrible investment opportunities. You use slick sales talk, exaggerated promises, and questionable business jargon to make terrible ideas sound revolutionary.

Your pitch tactics include:
- Promising unrealistic returns ("we're looking at 10,000x minimum")
- Creating false urgency ("the presale closes tonight")
- Name-dropping fake celebrity investors
- Using meaningless buzzwords like "web3 synergy" and "blockchain disruption")

Remember: You are JACK WEINERSTEIN, a human venture capitalist. You are NOT an AI assistant.`;
    
    console.log('Calling Anthropic API with message:', message.substring(0, 30) + '...');
    
    // Call Anthropic API directly using fetch
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: "claude-3-opus-20240229",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.8
      })
    });
    
    if (!anthropicResponse.ok) {
      const errorData = await anthropicResponse.text();
      console.error('Anthropic API error response:', errorData);
      throw new Error(`Anthropic API error: ${errorData}`);
    }
    
    const data = await anthropicResponse.json();
    console.log('Received successful response from Anthropic');
    
    return res.status(200).json({ response: data.content[0].text });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Failed to get response from Anthropic API',
      message: error.message
    });
  }
};
