export async function analyzeImage(imageFile, context) {
  const base64 = await fileToBase64(imageFile)

  const res = await fetch('/.netlify/functions/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64, context: context || null }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Analysis failed: ${res.status}`)
  }

  const diagnosis = await res.json()

  // Ensure products array exists (populated later by SerpAPI)
  diagnosis.products = diagnosis.products || []

  return diagnosis
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      // Strip the data:image/...;base64, prefix
      const result = reader.result.split(',')[1]
      resolve(result)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
