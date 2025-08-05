"use client"

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Plus, MoreHorizontal, Calendar, User, Flag, Clock } from 'lucide-react'
import { Task, TaskStatus, TaskPriority } from '@/lib/types/project'
import { useTasks } from '@/lib/hooks/use-projects'

interface KanbanBoardProps {
  projectId: string
}

interface KanbanColumn {
  id: TaskStatus
  title: string
  color: string
}

const columns: KanbanColumn[] = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-50' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-blue-50' },
  { id: 'review', title: 'Review', color: 'bg-yellow-50' },
  { id: 'done', title: 'Done', color: 'bg-green-50' },
]

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case 'highest':
      return 'bg-red-500 text-white'
    case 'high':
      return 'bg-red-100 text-red-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'low':
      return 'bg-green-100 text-green-800'
    case 'lowest':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (dateString?: string) => {
  if (!dateString) return null
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

interface TaskCardProps {
  task: Task
  isDragging?: boolean
}

const TaskCard = ({ task, isDragging = false }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-none"
    >
      <Card className="mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-sm font-medium line-clamp-2">
                {task.title}
              </CardTitle>
              {task.description && (
                <CardDescription className="text-xs line-clamp-2">
                  {task.description}
                </CardDescription>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2 h-6 w-6 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Task</DropdownMenuItem>
                <DropdownMenuItem>Assign to</DropdownMenuItem>
                <DropdownMenuItem>Add Comment</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Labels */}
            {task.labels && task.labels.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.labels.map((label) => (
                  <Badge key={label} variant="secondary" className="text-xs">
                    {label}
                  </Badge>
                ))}
              </div>
            )}

            {/* Task meta information */}
            <div className="space-y-2">
              {/* Assignee and Due Date */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                {task.assignee && (
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span className="truncate">{task.assignee.name}</span>
                  </div>
                )}
                {task.dueDate && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(task.dueDate)}</span>
                  </div>
                )}
              </div>

              {/* Time estimate */}
              {task.estimatedHours && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{task.estimatedHours}h estimated</span>
                </div>
              )}
            </div>

            {/* Priority and Avatar */}
            <div className="flex items-center justify-between">
              <Badge className={getPriorityColor(task.priority)}>
                <Flag className="mr-1 h-3 w-3" />
                {task.priority}
              </Badge>
              {task.assignee ? (
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={`/placeholder.svg?height=24&width=24&text=${task.assignee.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}`}
                  />
                  <AvatarFallback className="text-xs">
                    {task.assignee.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-3 w-3 text-gray-500" />
                </div>
              )}
            </div>

            {/* Story points */}
            {task.storyPoints && (
              <div className="flex justify-end">
                <Badge variant="outline" className="text-xs">
                  {task.storyPoints} pts
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface KanbanColumnProps {
  column: KanbanColumn
  tasks: Task[]
  onAddTask: (column: TaskStatus) => void
}

const KanbanColumn = ({ column, tasks, onAddTask }: KanbanColumnProps) => {
  const taskIds = tasks.map(task => task.id)

  return (
    <div className={`rounded-lg p-4 ${column.color} min-h-[600px]`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">{column.title}</h3>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{tasks.length}</Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onAddTask(column.id)}
            className="h-6 w-6 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

export default function KanbanBoard({ projectId }: KanbanBoardProps) {
  const { tasks, loading, error, reorderTask } = useTasks(projectId)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find(t => t.id === active.id)
    if (task) {
      setActiveTask(task)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveTask(null)
      return
    }

    const activeTask = tasks.find(t => t.id === active.id)
    if (!activeTask) {
      setActiveTask(null)
      return
    }

    // Determine the target column
    let targetColumn: TaskStatus
    let targetPosition: number

    // Check if dropped over a column container
    const columnId = over.id as string
    if (columns.some(col => col.id === columnId)) {
      targetColumn = columnId as TaskStatus
      const columnTasks = tasks.filter(t => t.status === targetColumn)
      targetPosition = columnTasks.length
    } else {
      // Dropped over another task
      const overTask = tasks.find(t => t.id === over.id)
      if (!overTask) {
        setActiveTask(null)
        return
      }
      
      targetColumn = overTask.status
      targetPosition = overTask.position
    }

    // Only update if the position or column has changed
    if (activeTask.status !== targetColumn || activeTask.position !== targetPosition) {
      await reorderTask(activeTask.id, targetColumn, targetPosition)
    }

    setActiveTask(null)
  }

  const handleAddTask = (column: TaskStatus) => {
    // TODO: Open task creation modal
    console.log('Add task to column:', column)
  }

  const getColumnTasks = (columnId: TaskStatus) => {
    return tasks
      .filter(task => task.status === columnId)
      .sort((a, b) => a.position - b.position)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading tasks</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={getColumnTasks(column.id)}
            onAddTask={handleAddTask}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  )
}