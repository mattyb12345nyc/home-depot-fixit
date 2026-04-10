import { AlertTriangle, CheckCircle, Clock, Gauge, ChevronRight } from 'lucide-react'

const severityConfig = {
  minor: { color: 'text-hd-green', bg: 'bg-green-50', label: 'Minor', border: 'border-green-200' },
  moderate: { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Moderate', border: 'border-yellow-200' },
  urgent: { color: 'text-hd-red', bg: 'bg-red-50', label: 'Urgent', border: 'border-red-200' },
}

export default function DiagnosisScreen({ diagnosis, imageUrl, onAccept, onRetake }) {
  const severity = severityConfig[diagnosis.severity]

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)]">
      {/* Image + badge */}
      <div className="relative">
        {imageUrl ? (
          <img src={imageUrl} alt="Issue" className="w-full aspect-video object-cover" />
        ) : (
          <div className="w-full aspect-video bg-gradient-to-br from-hd-orange/10 to-hd-orange/5 flex items-center justify-center">
            <span className="text-5xl">
              {diagnosis.id === 'leaky-faucet' ? '🚰' : diagnosis.id === 'cracked-deck' ? '🪵' : '🪟'}
            </span>
          </div>
        )}
        <div className={`absolute bottom-3 left-3 ${severity.bg} ${severity.border} border rounded-full px-3 py-1 flex items-center gap-1.5`}>
          <AlertTriangle size={14} className={severity.color} />
          <span className={`text-xs font-semibold ${severity.color}`}>{severity.label}</span>
        </div>
        <div className="absolute bottom-3 right-3 bg-hd-black/80 rounded-full px-3 py-1">
          <span className="text-white text-xs font-medium">{diagnosis.confidence}% confidence</span>
        </div>
      </div>

      {/* Diagnosis content */}
      <div className="px-5 py-5 animate-fade-in">
        <h2 className="text-xl font-bold text-hd-black mb-1">{diagnosis.title}</h2>
        <p className="text-hd-gray-text text-sm leading-relaxed mb-4">{diagnosis.summary}</p>

        {/* Findings */}
        <div className="bg-white rounded-xl border border-hd-gray-mid p-4 mb-4 animate-fade-in-delay">
          <h3 className="text-sm font-bold text-hd-black mb-3 uppercase tracking-wider">
            What We Found
          </h3>
          <div className="space-y-2.5">
            {diagnosis.details.map((detail, i) => (
              <div key={i} className="flex gap-2.5 items-start">
                <CheckCircle size={16} className="text-hd-orange mt-0.5 flex-shrink-0" />
                <span className="text-sm text-hd-dark leading-snug">{detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mb-6 animate-fade-in-delay-2">
          <div className="bg-white rounded-xl border border-hd-gray-mid p-3 text-center">
            <Clock size={18} className="text-hd-orange mx-auto mb-1" />
            <p className="text-xs text-hd-gray-text">Time</p>
            <p className="text-sm font-bold text-hd-black">{diagnosis.timeEstimate}</p>
          </div>
          <div className="bg-white rounded-xl border border-hd-gray-mid p-3 text-center">
            <Gauge size={18} className="text-hd-orange mx-auto mb-1" />
            <p className="text-xs text-hd-gray-text">Difficulty</p>
            <p className="text-sm font-bold text-hd-black">{diagnosis.difficultyOverall}</p>
          </div>
          <div className="bg-white rounded-xl border border-hd-gray-mid p-3 text-center">
            <span className="text-hd-orange text-lg font-bold block mb-0.5">$</span>
            <p className="text-xs text-hd-gray-text">Est. Materials</p>
            <p className="text-sm font-bold text-hd-black">{diagnosis.totalEstimate}</p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-auto px-5 pb-6 space-y-3">
        <button
          onClick={onAccept}
          className="w-full bg-hd-orange text-white font-bold py-4 rounded-xl
                     flex items-center justify-center gap-2 active:bg-hd-orange-dark transition-colors
                     shadow-lg shadow-hd-orange/25"
        >
          Show Me How to Fix It
          <ChevronRight size={20} />
        </button>
        <button
          onClick={onRetake}
          className="w-full bg-white text-hd-gray-text font-medium py-3 rounded-xl border border-hd-gray-mid
                     active:bg-hd-gray transition-colors"
        >
          Not quite right — retake photo
        </button>
      </div>
    </div>
  )
}
