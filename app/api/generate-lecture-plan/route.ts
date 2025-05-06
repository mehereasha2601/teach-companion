import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // Parse the incoming prompt
  const { prompt } = await request.json()

  // Ensure the server-side API key is available
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing GEMINI_API_KEY on the server' }, { status: 500 })
  }

  // Forward the request to Google Gemini API
  const googleResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  )

  const responseText = await googleResponse.text()

  // If the Gemini API returns an error, forward it
  if (!googleResponse.ok) {
    return NextResponse.json({ error: responseText }, { status: googleResponse.status })
  }

  // Parse and return the successful response
  const data = JSON.parse(responseText)
  return NextResponse.json(data)
} 