import Link from "next/link"
import { ExternalLink, Github } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProjectCardProps {
  title: string
  description: string
  technologies: string[]
  liveUrl: string
  repoUrl: string
}

export function ProjectCard({ title, description, technologies, liveUrl, repoUrl }: ProjectCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1">
            <ExternalLink className="h-4 w-4" />
            Live Demo
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={repoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1">
            <Github className="h-4 w-4" />
            Code
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

