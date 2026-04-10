import { useRef } from 'react'
import { Camera, Wrench, Zap, ShieldCheck } from 'lucide-react'

export default function CameraScreen({ onCapture, error }) {
  const fileInput = useRef(null)

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      onCapture(url, file)
    }
  }

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
          {/* Main capture button */}
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
