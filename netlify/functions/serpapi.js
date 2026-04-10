export default async (req) => {
  const url = new URL(req.url)
  const query = url.searchParams.get('q')

  if (!query) {
    return new Response(JSON.stringify({ error: 'Missing q parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const params = new URLSearchParams({
    engine: 'home_depot',
    q: query,
    api_key: process.env.VITE_SERPAPI_KEY,
  })

  const res = await fetch(`https://serpapi.com/search.json?${params}`)
  const data = await res.json()

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  })
}
