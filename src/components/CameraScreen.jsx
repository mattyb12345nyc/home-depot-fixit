import { useRef, useState } from 'react'
import { Camera, Wrench, Zap, ShieldCheck, X, ArrowRight } from 'lucide-react'

export default function CameraScreen({ onCapture, error }) {
  const fileInput = useRef(null)
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [context, setContext] = useState('')

  function handleFile(e) {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setPreview(URL.createObjectURL(f))
    }
  }

  function handleClear() {
    setPreview(null)
    setFile(null)
    setContext('')
    if (fileInput.current) fileInput.current.value = ''
  }

  function handleSubmit() {
    if (file && preview) {
      onCapture(preview, file, context.trim() || null)
    }
  }

  // Photo selected — show preview + context input
  if (preview) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-56px)]">
        {/* Preview image */}
        <div className="relative">
          <img src={preview} alt="Preview" className="w-full aspect-[4/3] object-cover" />
          <button
            onClick={handleClear}
            className="absolute top-3 right-3 bg-hd-black/60 text-white rounded-full p-2 active:bg-hd-black/80"
            aria-label="Remove photo"
          >
            <X size={18} />
          </button>
        </div>

        {/* Context input */}
        <div className="px-5 py-5 flex-1">
          <label className="block text-sm font-semibold text-hd-black mb-2">
            Describe the issue
            <span className="text-hd-gray-text font-normal ml-1">(optional)</span>
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g. The faucet has been dripping for a week, the handle feels loose when I turn it..."
            className="w-full border border-hd-gray-mid rounded-xl p-3 text-sm text-hd-dark
                       placeholder:text-hd-gray-text/60 resize-none focus:outline-none
                       focus:border-hd-orange focus:ring-1 focus:ring-hd-orange/30"
            rows={3}
          />
          <p className="text-xs text-hd-gray-text mt-2">
            Adding context helps our AI give you a more accurate diagnosis and better repair steps.
          </p>
        </div>

        {/* Submit button */}
        <div className="px-5 pb-6">
          <button
            onClick={handleSubmit}
            className="w-full bg-hd-orange text-white font-bold py-4 rounded-xl
                       flex items-center justify-center gap-2 active:bg-hd-orange-dark transition-colors
                       shadow-lg shadow-hd-orange/25"
          >
            Analyze This
            <ArrowRight size={20} />
          </button>
          <button
            onClick={handleClear}
            className="w-full text-hd-gray-text font-medium py-3 mt-2
                       active:text-hd-dark transition-colors text-sm"
          >
            Choose a different photo
          </button>
        </div>
      </div>
    )
  }

  // No photo yet — show camera capture
  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)]">
      {/* Hero */}
      <div className="bg-hd-orange px-6 pt-8 pb-10 text-center text-white">
        <h1 className="text-2xl font-bold mb-2 tracking-tight animate-fade-in">
          Snap it. Fix it. Done.
        </h1>
        <p className="text-white/85 text-sm animate-fade-in-delay">
          Take a photo of anything broken around your home — we'll tell you exactly how to fix it.
        </p>
      </div>

      {/* Camera Capture Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-6">
        <div className="w-full max-w-sm animate-fade-in-delay">
          <button
            onClick={() => fileInput.current?.click()}
            className="w-full bg-white rounded-2xl shadow-lg border-2 border-dashed border-hd-orange/30
                       hover:border-hd-orange/60 active:scale-[0.98] transition-all
                       flex flex-col items-center justify-center py-12 px-6 group"
          >
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-hd-orange/10 flex items-center justify-center
                            group-active:bg-hd-orange/20 transition-colors">
                <Camera size={36} className="text-hd-orange" />
              </div>
              <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-hd-orange/30 animate-pulse-ring" />
            </div>
            <span className="text-hd-black font-semibold text-lg">Take a Photo</span>
            <span className="text-hd-gray-text text-sm mt-1">or tap to upload from your gallery</span>
          </button>

          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFile}
            className="hidden"
          />

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-sm text-hd-red font-medium">Analysis failed</p>
              <p className="text-xs text-hd-gray-text mt-1">{error}</p>
              <p className="text-xs text-hd-gray-text mt-1">Please try again with a clearer photo.</p>
            </div>
          )}
        </div>
      </div>

      {/* Feature Pills */}
      <div className="px-6 pb-8 pt-4 animate-fade-in-delay-2">
        <div className="flex justify-center gap-4 text-xs text-hd-gray-text">
          <div className="flex items-center gap-1">
            <Zap size={14} className="text-hd-orange" />
            <span>AI-Powered</span>
          </div>
          <div className="flex items-center gap-1">
            <Wrench size={14} className="text-hd-orange" />
            <span>Step-by-Step</span>
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck size={14} className="text-hd-orange" />
            <span>Pro Tips</span>
          </div>
        </div>
      </div>

      {/* Bottom tagline */}
      <div className="bg-hd-black text-center py-3 px-4">
        <p className="text-white/70 text-xs">
          You can do it. We can help.&trade;
        </p>
      </div>
    </div>
  )
}
