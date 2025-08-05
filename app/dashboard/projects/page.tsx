"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, FolderOpen } from "lucide-react"
import { useProjects } from "@/lib/hooks/use-projects"
import KanbanBoard from "@/components/project-management/kanban-board"

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProject, setSelectedProject] = useState<string>("")
  const { projects, loading: projectsLoading, error: projectsError } = useProjects()

  // Auto-select first project if available
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0].id)
    }
  }, [projects, selectedProject])

  if (projectsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    )
  }

  if (projectsError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading projects</p>
          <p className="text-gray-600 text-sm">{projectsError}</p>
        </div>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
            <p className="text-muted-foreground">Track tasks, milestones, and team progress</p>
          </div>
        </div>
        <Card className="text-center py-12">
          <CardContent>
            <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No projects found</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first project.</p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentProject = projects.find(p => p.id === selectedProject)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
          <p className="text-muted-foreground">Track tasks, milestones, and team progress</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      {/* Project Selection and Filters */}
      <div className="flex items-center space-x-4">
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: project.color }}
                  />
                  <span>{project.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Project Info */}
      {currentProject && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: currentProject.color }}
                />
                <div>
                  <CardTitle>{currentProject.name}</CardTitle>
                  {currentProject.description && (
                    <CardDescription>{currentProject.description}</CardDescription>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>{currentProject.taskCount || 0} tasks</span>
                <span>{currentProject.completedTaskCount || 0} completed</span>
                <span>{currentProject.progressPercentage}% progress</span>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Kanban Board */}
      <Tabs defaultValue="kanban" className="space-y-4">
        <TabsList>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="space-y-4">
          {selectedProject ? (
            <KanbanBoard projectId={selectedProject} />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">Select a project to view tasks</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>All Tasks</CardTitle>
              <CardDescription>Complete list of all project tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">List view implementation coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Task Calendar</CardTitle>
              <CardDescription>View tasks by due date</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Calendar view implementation coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
