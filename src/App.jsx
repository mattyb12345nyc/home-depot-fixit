import { useState, useCallback, useEffect } from 'react'
import Header from './components/Header'
import CameraScreen from './components/CameraScreen'
import AnalyzingScreen from './components/AnalyzingScreen'
import DiagnosisScreen from './components/DiagnosisScreen'
import RepairGuideScreen from './components/RepairGuideScreen'
import ProjectsScreen from './components/ProjectsScreen'
import { getRandomDiagnosis } from './data/mockDiagnoses'
import { saveProject, getProjects, deleteProject, rowToDiagnosis } from './lib/supabase'
import './index.css'

const SCREENS = {
  CAMERA: 'camera',
  ANALYZING: 'analyzing',
  DIAGNOSIS: 'diagnosis',
  REPAIR: 'repair',
  PROJECTS: 'projects',
}

export default function App() {
  const [screen, setScreen] = useState(SCREENS.CAMERA)
  const [imageUrl, setImageUrl] = useState(null)
  const [diagnosis, setDiagnosis] = useState(null)
  const [projects, setProjects] = useState([])
  const [currentProjectId, setCurrentProjectId] = useState(null)

  useEffect(() => {
    getProjects().then(setProjects).catch(console.error)
  }, [])

  function handleCapture(url) {
    setImageUrl(url)
    setDiagnosis(getRandomDiagnosis())
    setScreen(SCREENS.ANALYZING)
  }

  const handleAnalysisComplete = useCallback(() => {
    setScreen(SCREENS.DIAGNOSIS)
  }, [])

  async function handleAcceptDiagnosis() {
    // Save to Supabase when user accepts the diagnosis
    try {
      const saved = await saveProject({ diagnosis, imageUrl })
      setCurrentProjectId(saved.id)
      // Refresh projects list
      const updated = await getProjects()
      setProjects(updated)
    } catch (err) {
      console.error('Failed to save project:', err)
    }
    setScreen(SCREENS.REPAIR)
  }

  function handleRetake() {
    setImageUrl(null)
    setDiagnosis(null)
    setCurrentProjectId(null)
    setScreen(SCREENS.CAMERA)
  }

  function handleShowProjects() {
    getProjects().then(setProjects).catch(console.error)
    setScreen(SCREENS.PROJECTS)
  }

  function handleSelectProject(project) {
    setDiagnosis(rowToDiagnosis(project))
    setImageUrl(project.image_url)
    setCurrentProjectId(project.id)
    setScreen(SCREENS.REPAIR)
  }

  async function handleDeleteProject(id) {
    try {
      await deleteProject(id)
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error('Failed to delete project:', err)
    }
  }

  function headerTitle() {
    switch (screen) {
      case SCREENS.ANALYZING: return 'Analyzing...'
      case SCREENS.DIAGNOSIS: return 'Diagnosis'
      case SCREENS.REPAIR: return 'Repair Guide'
      case SCREENS.PROJECTS: return 'My Projects'
      default: return 'FixIt'
    }
  }

  function handleBack() {
    switch (screen) {
      case SCREENS.ANALYZING: return handleRetake()
      case SCREENS.DIAGNOSIS: return handleRetake()
      case SCREENS.REPAIR: return setScreen(SCREENS.DIAGNOSIS)
      case SCREENS.PROJECTS: return handleRetake()
      default: return null
    }
  }

  const showProjectsBtn = screen === SCREENS.CAMERA

  return (
    <div className="max-w-md mx-auto min-h-screen bg-hd-gray shadow-2xl">
      <Header
        title={headerTitle()}
        onBack={screen !== SCREENS.CAMERA ? handleBack : null}
        onProjects={handleShowProjects}
        showProjectsBtn={showProjectsBtn}
      />

      {screen === SCREENS.CAMERA && (
        <CameraScreen onCapture={handleCapture} />
      )}

      {screen === SCREENS.ANALYZING && (
        <AnalyzingScreen imageUrl={imageUrl} onComplete={handleAnalysisComplete} />
      )}

      {screen === SCREENS.DIAGNOSIS && diagnosis && (
        <DiagnosisScreen
          diagnosis={diagnosis}
          imageUrl={imageUrl}
          onAccept={handleAcceptDiagnosis}
          onRetake={handleRetake}
        />
      )}

      {screen === SCREENS.REPAIR && diagnosis && (
        <RepairGuideScreen
          diagnosis={diagnosis}
          projectId={currentProjectId}
          onStartOver={handleRetake}
        />
      )}

      {screen === SCREENS.PROJECTS && (
        <ProjectsScreen
          projects={projects}
          onSelectProject={handleSelectProject}
          onDeleteProject={handleDeleteProject}
        />
      )}
    </div>
  )
}
