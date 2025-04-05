'use client'

import { useState, useEffect } from 'react'
import Select from 'react-select'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'

interface TechnologyOption {
  value: string
  label: string
}

export default function ProjectForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [repoUrl, setRepoUrl] = useState('')
  const [technologyOptions, setTechnologyOptions] = useState<TechnologyOption[]>([])
  const [selectedTechnologies, setSelectedTechnologies] = useState<TechnologyOption[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const fetchTechnologies = async () => {
      const { data, error } = await supabase.from('technology').select('id, name')
      if (error) {
        setError('Failed to load technologies')
      } else {
        const options = data.map((tech: { id: string, name: string }) => ({
          value: tech.id,
          label: tech.name,
        }))
        setTechnologyOptions(options)
      }
    }
    fetchTechnologies()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const techIds = selectedTechnologies.map(tech => tech.value)

    const { error } = await supabase.from('project').insert({
      title,
      description,
      live_url: liveUrl,
      repo_url: repoUrl,
      tech_1: techIds[0] || null,
      tech_2: techIds[1] || null,
      tech_3: techIds[2] || null,
      tech_4: techIds[3] || null,
      tech_5: techIds[4] || null,
      tech_6: techIds[5] || null,
      tech_7: techIds[6] || null,
      tech_8: techIds[7] || null,
      tech_9: techIds[8] || null,
      tech_10: techIds[9] || null,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess('Project submitted successfully!')
      setTitle('')
      setDescription('')
      setLiveUrl('')
      setRepoUrl('')
      setSelectedTechnologies([])
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <input
          type="url"
          placeholder="Live URL"
          value={liveUrl}
          onChange={(e) => setLiveUrl(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <input
          type="url"
          placeholder="Repo URL"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <Select
          isMulti
          options={technologyOptions}
          value={selectedTechnologies}
          onChange={(selected) => setSelectedTechnologies(selected as TechnologyOption[])}
          placeholder="Select Technologies"
          className="w-full"
          maxMenuHeight={150}
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Project'}
      </Button>
    </form>
  )
}