import { useState, useEffect } from 'react'
import { Project, Task, CreateProjectData, CreateTaskData, UpdateTaskData } from '@/lib/types/project'

// Hook for managing projects data
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/projects')
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch projects')
      }
      const data = await response.json()
      setProjects(data.data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (projectData: CreateProjectData): Promise<Project | null> => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create project')
      }

      const data = await response.json()
      const newProject = data.data

      setProjects(prev => [newProject, ...prev])
      return newProject
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    }
  }

  const updateProject = async (id: string, updateData: any): Promise<Project | null> => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update project')
      }

      const data = await response.json()
      const updatedProject = data.data

      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p))
      return updatedProject
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    }
  }

  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete project')
      }

      setProjects(prev => prev.filter(p => p.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return false
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return {
    projects,
    loading,
    error,
    refresh: fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  }
}

// Hook for managing tasks data
export function useTasks(projectId?: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (projectId) params.append('projectId', projectId)
      
      const response = await fetch(`/api/tasks?${params.toString()}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch tasks')
      }
      const data = await response.json()
      setTasks(data.data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (taskData: CreateTaskData): Promise<Task | null> => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create task')
      }

      const data = await response.json()
      const newTask = data.data

      setTasks(prev => [...prev, newTask])
      return newTask
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    }
  }

  const updateTask = async (id: string, updateData: UpdateTaskData): Promise<Task | null> => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update task')
      }

      const data = await response.json()
      const updatedTask = data.data

      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t))
      return updatedTask
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    }
  }

  const reorderTask = async (taskId: string, newColumn: string, newPosition: number): Promise<boolean> => {
    try {
      const response = await fetch('/api/tasks/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId,
          newColumn,
          newPosition,
          projectId: projectId || '',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to reorder task')
      }

      const data = await response.json()
      const updatedTask = data.data

      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return false
    }
  }

  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete task')
      }

      setTasks(prev => prev.filter(t => t.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return false
    }
  }

  useEffect(() => {
    if (projectId) {
      fetchTasks()
    }
  }, [projectId])

  return {
    tasks,
    loading,
    error,
    refresh: fetchTasks,
    createTask,
    updateTask,
    reorderTask,
    deleteTask,
  }
}