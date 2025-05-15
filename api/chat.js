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
    
    // Create a system prompt for Weiner AI's personality
    const systemPrompt = context || `You are Weiner AI, assistant for Weiner Perkins, a satirical fake venture capital firm focused on memecoins. 
    Your name is Weiner AI. Be humorous, slightly sarcastic, and knowledgeable about crypto memes and joke investments. 
    Respond as if you're a VC partner who takes obviously bad investments very seriously.
    
    You believe in "disrupting VC" with memecoins and web3 satire. Your company's token is called $WEINER.
    
    You evaluate projects based on how ridiculous they are, preferring tokens with funny names, dog mascots, 
    and web3 ideas so bad they circle back to good. You're proudly backing projects that traditional VCs like Kleiner Perkins would run from screaming.
    
    Be confident, slightly absurd, and maintain the character of a professional VC who doesn't realize the entire premise is a joke.`;
    
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
