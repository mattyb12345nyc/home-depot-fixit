export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'POST required' }), { status: 405 })
  }

  const { image, context } = await req.json()
  if (!image) {
    return new Response(JSON.stringify({ error: 'image (base64) required' }), { status: 400 })
  }

  const mediaType = image.startsWith('/9j/') ? 'image/jpeg' : 'image/png'

  const contextLine = context
    ? `\n\nThe user provided this additional context about the issue: "${context}"\nUse this context to inform your diagnosis — it may help identify the problem more accurately.`
    : ''

  const prompt = `You are a Home Depot home repair expert AI. Analyze this image and identify what needs to be fixed or repaired.${contextLine}

Return a JSON object with this exact structure (no markdown, no code fences, just raw JSON):
{
  "id": "short-kebab-case-id",
  "title": "Short descriptive title of the issue",
  "severity": "minor" | "moderate" | "urgent",
  "confidence": 85-99,
  "summary": "2-3 sentence description of the problem, what likely caused it, and why it should be fixed.",
  "details": [
    "Specific observation 1 from the image",
    "Specific observation 2",
    "Specific observation 3",
    "Specific observation 4"
  ],
  "steps": [
    {
      "step": 1,
      "title": "Step title",
      "description": "Detailed instructions for this step. Be specific about tools, techniques, and tips.",
      "duration": "X min",
      "difficulty": "Easy" | "Medium" | "Hard"
    }
  ],
  "searchQueries": ["home depot search query 1", "home depot search query 2", "home depot search query 3"],
  "timeEstimate": "X-Y hours",
  "difficultyOverall": "Beginner" | "DIY Friendly" | "Intermediate" | "Advanced",
  "totalEstimate": "$XX.XX"
}

Rules:
- Be VERY specific about what you see in the image. Describe the actual damage, material, location.
- Steps should be detailed enough for a homeowner to follow without prior experience.
- searchQueries should be 2-4 specific product searches that would return relevant results on homedepot.com (e.g. "faucet cartridge repair kit", "deck screws stainless steel").
- totalEstimate should be a reasonable estimate for materials only (not tools).
- If you cannot identify a clear repair issue, describe what you see and suggest a maintenance task.
- Return ONLY valid JSON, no other text.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: image,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    console.error('Claude API error:', err)
    return new Response(JSON.stringify({ error: 'Analysis failed', details: err }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const result = await response.json()
  const text = result.content?.[0]?.text || ''

  try {
    const diagnosis = JSON.parse(text)
    return new Response(JSON.stringify(diagnosis), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    if (match) {
      return new Response(match[0], {
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return new Response(JSON.stringify({ error: 'Failed to parse analysis', raw: text }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
