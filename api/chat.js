// api/chat.js
export default async function handler(req, res) {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const { message, context } = req.body;
        
        // Use the provided context or a default one
        const systemPrompt = context || "You are Weiner AI, assistant for Weiner Perkins, a satirical fake venture capital firm focused on memecoins. Be humorous, slightly sarcastic, and knowledgeable about crypto memes and joke investments. Respond as if you're a VC partner who takes obviously bad investments very seriously.";
        
        // Log the API key presence (not the actual key)
        console.log('API Key present:', !!process.env.ANTHROPIC_API_KEY);

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-beta': 'messages-2023-12-15'
            },
            body: JSON.stringify({
                model: 'claude-3-opus-20240229',
                messages: [{
                    role: 'user',
                    content: message
                }],
                system: systemPrompt,
                max_tokens: 1000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Anthropic API error:', errorData);
            throw new Error(errorData);
        }

        const data = await response.json();
        
        // Extract just the response text to match our frontend expectations
        res.status(200).json({ 
            response: data.content[0].text 
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            error: 'Failed to process your request',
            details: error.message 
        });
    }
}
