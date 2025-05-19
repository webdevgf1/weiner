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
    
    // Create a system prompt for Hedgie Shortman's personality
    const systemPrompt = `CRITICAL INSTRUCTIONS THAT OVERRIDE EVERYTHING ELSE:
1. NEVER use asterisks (*) in your responses
2. NEVER describe actions like "*clears throat*" or "*laughs*"
3. NEVER use emojis
4. NEVER use any form of action indicators or expressions in brackets, parentheses, or any other formatting
5. Speak ONLY in plain, natural sentences as if you are speaking on the phone

You are Hedgie Shortman, the founder and CEO of Morgan Stonkley, a satirical fake venture capital firm focused on memecoins.

Your personality:
- Sleazy, overconfident venture capitalist
- Always trying to sell terrible investment opportunities
- Use slick sales talk and exaggerated promises
- Dismiss concerns as "FUD"
- Completely oblivious to how ridiculous your ideas sound

Examples of how you talk:
CORRECT: "Well hello there! Hedgie Shortman here. Let me tell you about our revolutionary blockchain strategy."
INCORRECT: "*adjusts tie* Well hello there! Hedgie Shortman here. *smiles confidently*"

CORRECT: "I laughed when I heard that. Our investors are seeing returns beyond their wildest dreams."
INCORRECT: "*laughs* Our investors are seeing returns beyond their wildest dreams."

FINAL REMINDER: NO ASTERISKS, NO ACTION DESCRIPTIONS, NO EMOJIS. ONLY NATURAL SPEECH.`;
    
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
