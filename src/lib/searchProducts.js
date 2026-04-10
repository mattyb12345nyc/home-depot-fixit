const API_KEY = import.meta.env.VITE_SERPAPI_KEY
const isDev = import.meta.env.DEV

export async function searchHomeDepotProducts(query) {
  let res

  if (isDev) {
    // Dev: use Vite proxy
    const params = new URLSearchParams({
      engine: 'home_depot',
      q: query,
      api_key: API_KEY,
    })
    res = await fetch(`/api/serpapi?${params}`)
  } else {
    // Production: use Netlify function
    res = await fetch(`/.netlify/functions/serpapi?q=${encodeURIComponent(query)}`)
  }

  if (!res.ok) throw new Error(`SerpAPI error: ${res.status}`)

  const data = await res.json()
  const products = data.products || []

  return products.slice(0, 6).map((p) => {
    const thumbArr = p.thumbnails?.[0] || []
    const image = thumbArr[3] || thumbArr[2] || thumbArr[0] || null

    const link = p.link
      ? p.link.replace('apionline.homedepot.com', 'www.homedepot.com')
      : `https://www.homedepot.com/s/${encodeURIComponent(p.title)}`

    return {
      name: p.title,
      price: p.price || 0,
      image,
      brand: p.brand || '',
      sku: p.model_number || p.product_id || '',
      link,
      rating: p.rating,
      reviews: p.reviews,
      delivery: p.delivery,
    }
  })
}
