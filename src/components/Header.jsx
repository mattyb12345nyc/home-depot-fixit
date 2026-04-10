import { ArrowLeft, FolderOpen } from 'lucide-react'

export default function Header({ onBack, title, onProjects, showProjectsBtn }) {
  return (
    <header className="bg-hd-orange shadow-md">
      <div className="flex items-center h-14 px-4">
        {onBack && (
          <button
            onClick={onBack}
            className="mr-3 p-1 -ml-1 text-white active:opacity-70"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <div className="flex items-center gap-2 flex-1">
          <img
            src="https://cdn.prod.website-files.com/6987deaedc4a144077581457/69d91cba292a1504b6432310_THD_logo%20(1).jpg"
            alt="The Home Depot"
            className="h-8 w-auto flex-shrink-0 rounded"
          />
          <span className="text-white font-bold text-lg tracking-tight">
            {title || 'FixIt'}
          </span>
        </div>
        {showProjectsBtn && onProjects && (
          <button
            onClick={onProjects}
            className="p-2 -mr-1 text-white active:opacity-70"
            aria-label="My Projects"
          >
            <FolderOpen size={22} />
          </button>
        )}
      </div>
    </header>
  )
}
