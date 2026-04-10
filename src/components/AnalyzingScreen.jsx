import { useEffect, useState } from 'react'
import { ScanLine, CheckCircle } from 'lucide-react'

const ANALYSIS_STEPS = [
  'Identifying object...',
  'Detecting damage...',
  'Analyzing severity...',
  'Finding repair solutions...',
  'Matching products...',
]

export default function AnalyzingScreen({ imageUrl, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const stepDuration = 1200
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= ANALYSIS_STEPS.length - 1) {
          // Loop back to keep animating while waiting for real analysis
          return 0
        }
        return prev + 1
      })
    }, stepDuration)

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95 // Hold at 95% until real analysis completes
        return prev + 1
      })
    }, 120)

    return () => {
      clearInterval(timer)
      clearInterval(progressTimer)
    }
  }, [])

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)] bg-hd-black">
      {/* Image with scan overlay */}
      <div className="relative w-full aspect-square max-h-[50vh] overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Captured"
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-hd-dark to-hd-black flex items-center justify-center">
            <div className="text-6xl opacity-30">🔍</div>
          </div>
        )}

        {/* Scan line */}
        <div className="absolute inset-0">
          <div className="absolute left-0 right-0 h-[3px] bg-hd-orange shadow-[0_0_15px_rgba(244,131,34,0.8)] animate-scan" />
        </div>

        {/* Corner markers */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-hd-orange" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-hd-orange" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-hd-orange" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-hd-orange" />

        {/* Scanning icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-hd-orange/20 flex items-center justify-center">
            <ScanLine size={32} className="text-hd-orange animate-spin-slow" />
          </div>
        </div>
      </div>

      {/* Analysis progress */}
      <div className="flex-1 px-6 py-8">
        <h2 className="text-white text-xl font-bold mb-2 animate-fade-in">
          Analyzing Your Photo...
        </h2>

        {/* Progress bar */}
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-hd-orange to-hd-orange-light rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {ANALYSIS_STEPS.map((step, i) => (
            <div
              key={step}
              className={`flex items-center gap-3 transition-opacity duration-300 ${
                i <= currentStep ? 'opacity-100' : 'opacity-30'
              }`}
            >
              {i < currentStep ? (
                <CheckCircle size={18} className="text-hd-green flex-shrink-0" />
              ) : i === currentStep ? (
                <div className="w-[18px] h-[18px] rounded-full border-2 border-hd-orange border-t-transparent animate-spin flex-shrink-0" />
              ) : (
                <div className="w-[18px] h-[18px] rounded-full border border-white/20 flex-shrink-0" />
              )}
              <span className={`text-sm ${i <= currentStep ? 'text-white' : 'text-white/40'}`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Home Depot AI badge */}
      <div className="text-center pb-6 px-6">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
          <div className="w-2 h-2 rounded-full bg-hd-orange animate-pulse" />
          <span className="text-white/50 text-xs">Powered by Home Depot AI</span>
        </div>
      </div>
    </div>
  )
}
