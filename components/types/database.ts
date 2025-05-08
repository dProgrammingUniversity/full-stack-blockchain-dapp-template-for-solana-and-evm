export interface Technology {
    id: string
    name: string
  }
  
  export interface ProjectFromDB {
    id: string
    title: string
    description: string
    live_url: string
    repo_url: string
    tech_1: string | null
    tech_2: string | null
    tech_3: string | null
    tech_4: string | null
    tech_5: string | null
    tech_6: string | null
    tech_7: string | null
    tech_8: string | null
    tech_9: string | null
    tech_10: string | null
    created_at: string
  }
  
  export interface ProjectDisplay {
    title: string
    description: string
    technologies: string[]
    liveUrl: string
    repoUrl: string
  }