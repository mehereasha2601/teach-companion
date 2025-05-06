import { NextResponse } from 'next/server';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { prompt } = req.body;

        // Call the OpenAI API
        const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Ensure this is set correctly
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
            }),
        });

        if (!openAIResponse.ok) {
            const errorData = await openAIResponse.json();
            console.error("OpenAI Error Response:", errorData);
            return res.status(openAIResponse.status).json({ error: 'Failed to fetch from OpenAI', details: errorData });
        }

        const data = await openAIResponse.json();
        console.log("API Call Response:", data);
        return res.status(200).json(data.choices[0].message.content); // Return the response content
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
