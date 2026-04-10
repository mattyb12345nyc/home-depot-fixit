import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export async function saveProject({ diagnosis, imageUrl, completedSteps = 0 }) {
  const { data, error } = await supabase
    .from('projects')
    .insert({
      title: diagnosis.title,
      diagnosis_id: diagnosis.id,
      severity: diagnosis.severity,
      confidence: diagnosis.confidence,
      summary: diagnosis.summary,
      details: diagnosis.details,
      steps: diagnosis.steps,
      search_queries: diagnosis.searchQueries || [],
      time_estimate: diagnosis.timeEstimate,
      difficulty: diagnosis.difficultyOverall,
      total_estimate: diagnosis.totalEstimate,
      image_url: imageUrl,
      completed_steps: completedSteps,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function updateProjectSteps(id, completedSteps) {
  const { error } = await supabase
    .from('projects')
    .update({ completed_steps: completedSteps, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

export async function deleteProject(id) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Convert a DB row back to a diagnosis object the app understands
export function rowToDiagnosis(row) {
  return {
    id: row.diagnosis_id,
    title: row.title,
    severity: row.severity,
    confidence: row.confidence,
    summary: row.summary,
    details: row.details,
    steps: row.steps,
    searchQueries: row.search_queries,
    timeEstimate: row.time_estimate,
    difficultyOverall: row.difficulty,
    totalEstimate: row.total_estimate,
    products: [],
  }
}
