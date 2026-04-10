import { FolderOpen, Clock, Gauge, Trash2, ChevronRight, AlertTriangle } from 'lucide-react'

const severityConfig = {
  minor: { color: 'text-hd-green', bg: 'bg-green-50', label: 'Minor' },
  moderate: { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Moderate' },
  urgent: { color: 'text-hd-red', bg: 'bg-red-50', label: 'Urgent' },
}

export default function ProjectsScreen({ projects, onSelectProject, onDeleteProject }) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-8 text-center">
        <div className="w-20 h-20 rounded-full bg-hd-orange/10 flex items-center justify-center mb-4">
          <FolderOpen size={36} className="text-hd-orange" />
        </div>
        <h2 className="text-xl font-bold text-hd-black mb-2">No Projects Yet</h2>
        <p className="text-hd-gray-text text-sm leading-relaxed">
          When you scan and diagnose an issue, it'll be saved here so you can come back to it anytime.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-56px)]">
      <div className="px-5 py-4">
        <p className="text-xs text-hd-gray-text uppercase tracking-wider font-medium mb-3">
          {projects.length} saved project{projects.length !== 1 ? 's' : ''}
        </p>

        <div className="space-y-3">
          {projects.map((project) => {
            const severity = severityConfig[project.diagnosis.severity]
            const date = new Date(project.savedAt)
            const dateStr = date.toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
            })

            return (
              <div
                key={project.id}
                className="bg-white rounded-xl border border-hd-gray-mid overflow-hidden animate-fade-in"
              >
                <button
                  onClick={() => onSelectProject(project)}
                  className="w-full flex items-center gap-3 p-4 text-left active:bg-hd-gray transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-lg bg-hd-gray overflow-hidden flex-shrink-0">
                    {project.imageUrl ? (
                      <img src={project.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        {project.diagnosis.id === 'leaky-faucet' ? '🚰' :
                         project.diagnosis.id === 'cracked-deck' ? '🪵' : '🔧'}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-hd-black truncate">
                      {project.diagnosis.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-medium ${severity.color} flex items-center gap-0.5`}>
                        <AlertTriangle size={10} />
                        {severity.label}
                      </span>
                      <span className="text-xs text-hd-gray-text">
                        {project.diagnosis.totalEstimate}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-hd-gray-text flex items-center gap-1">
                        <Clock size={10} /> {dateStr}
                      </span>
                      {project.completedSteps > 0 && (
                        <span className="text-xs text-hd-green font-medium">
                          {project.completedSteps}/{project.diagnosis.steps.length} steps done
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight size={18} className="text-hd-gray-text flex-shrink-0" />
                </button>

                {/* Delete */}
                <div className="border-t border-hd-gray-mid px-4 py-2 flex justify-end">
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id) }}
                    className="text-xs text-hd-gray-text flex items-center gap-1 active:text-hd-red transition-colors"
                  >
                    <Trash2 size={12} />
                    Remove
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
