'use client'

import { useState } from 'react'
import { ProjectCard } from './project-card'
import { Button } from './ui/button'
import type { ProjectDisplay } from '@/components/types/database'

interface ProjectsSectionProps {
  projects: ProjectDisplay[]
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [showAllProjects, setShowAllProjects] = useState(false)

  return (
    <section id="projects" className="container space-y-6 bg-orange-50 py-8 dark:bg-slate-900 md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="text-3xl font-bold leading-tight tracking-tighter sm:text-4xl md:text-5xl">Projects</h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          A selection of my recent work in the web3 space
        </p>
      </div>
      <div className="mx-auto grid justify-center gap-6 sm:grid-cols-2 md:max-w-[64rem] lg:grid-cols-3">
        {projects.slice(0, 4).map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
        {showAllProjects &&
          projects.slice(4).map((project, index) => (
            <ProjectCard key={index + 4} {...project} />
          ))}
      </div>
      <div className="flex justify-center mt-4">
        <Button onClick={() => setShowAllProjects(!showAllProjects)}>
          {showAllProjects ? "Show Less" : "View All Projects"}
        </Button>
      </div>
    </section>
  )
}