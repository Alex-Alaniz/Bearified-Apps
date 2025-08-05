// Project Management Type Definitions

import { User } from "../supabase"

// Project Types
export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'
export type ProjectPriority = 'low' | 'medium' | 'high' | 'critical'

export interface Project {
  id: string
  name: string
  description?: string
  status: ProjectStatus
  priority: ProjectPriority
  startDate?: string
  endDate?: string
  createdAt: string
  updatedAt: string
  progressPercentage: number
  budget?: number
  ownerId: string
  organizationId?: string
  isArchived: boolean
  isTemplate: boolean
  color: string
  icon: string
  
  // Computed/joined fields (optional - loaded when needed)
  owner?: User
  members?: ProjectMember[]
  taskCount?: number
  completedTaskCount?: number
  inProgressTaskCount?: number
  overdueTaskCount?: number
  teamSize?: number
  totalTimeMinutes?: number
}

// Task Types
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled'
export type TaskPriority = 'lowest' | 'low' | 'medium' | 'high' | 'highest'

export interface Task {
  id: string
  title: string
  description?: string
  projectId: string
  parentTaskId?: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId?: string
  reporterId?: string
  createdAt: string
  updatedAt: string
  dueDate?: string
  completedAt?: string
  estimatedHours?: number
  actualHours: number
  boardColumn: string
  position: number
  storyPoints?: number
  labels: string[]
  
  // Computed/joined fields (optional - loaded when needed)
  project?: Project
  assignee?: User
  reporter?: User
  comments?: TaskComment[]
  attachments?: TaskAttachment[]
  timeEntries?: TimeEntry[]
  subtasks?: Task[]
  dependencies?: TaskDependency[]
  parentTask?: Task
}

// Project Member Types
export type ProjectMemberRole = 'owner' | 'manager' | 'member' | 'viewer'

export interface ProjectMember {
  id: string
  projectId: string
  userId: string
  role: ProjectMemberRole
  joinedAt: string
  
  // Joined fields
  user?: User
}

// Task Comment Types
export interface TaskComment {
  id: string
  taskId: string
  userId: string
  content: string
  createdAt: string
  updatedAt: string
  isEdited: boolean
  
  // Joined fields
  user?: User
}

// Task Attachment Types
export interface TaskAttachment {
  id: string
  taskId: string
  userId: string
  fileName: string
  fileUrl: string
  fileSize?: number
  mimeType?: string
  createdAt: string
  
  // Joined fields
  user?: User
}

// Time Entry Types
export interface TimeEntry {
  id: string
  taskId: string
  userId: string
  description?: string
  startTime?: string
  endTime?: string
  durationMinutes?: number
  createdAt: string
  
  // Joined fields
  user?: User
  task?: Task
}

// Task Dependency Types
export type DependencyType = 'finish_to_start' | 'start_to_start' | 'finish_to_finish' | 'start_to_finish'

export interface TaskDependency {
  id: string
  predecessorId: string
  successorId: string
  dependencyType: DependencyType
  createdAt: string
  
  // Joined fields
  predecessor?: Task
  successor?: Task
}

// Custom Field Types (for extensibility)
export type CustomFieldType = 'text' | 'number' | 'date' | 'dropdown' | 'multi_select' | 'checkbox'

export interface CustomField {
  id: string
  projectId: string
  fieldName: string
  fieldType: CustomFieldType
  fieldOptions?: any // JSON data for dropdown options, etc.
  isRequired: boolean
  createdAt: string
}

export interface TaskCustomValue {
  id: string
  taskId: string
  customFieldId: string
  value?: string
  
  // Joined fields  
  customField?: CustomField
}

// Project Template Types
export interface ProjectTemplate {
  id: string
  name: string
  description?: string
  category?: string
  isPublic: boolean
  createdBy?: string
  createdAt: string
  templateData: any // JSON structure defining the template
  
  // Joined fields
  creator?: User
}

// Form/Input Types for Creating/Updating
export interface CreateProjectData {
  name: string
  description?: string
  priority?: ProjectPriority
  startDate?: string
  endDate?: string
  budget?: number
  color?: string
  icon?: string
}

export interface UpdateProjectData {
  name?: string
  description?: string
  status?: ProjectStatus
  priority?: ProjectPriority
  startDate?: string
  endDate?: string
  budget?: number
  color?: string
  icon?: string
  isArchived?: boolean
}

export interface CreateTaskData {
  title: string
  description?: string
  projectId: string
  parentTaskId?: string
  priority?: TaskPriority
  assigneeId?: string
  dueDate?: string
  estimatedHours?: number
  boardColumn?: string
  storyPoints?: number
  labels?: string[]
}

export interface UpdateTaskData {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  assigneeId?: string
  dueDate?: string
  estimatedHours?: number
  boardColumn?: string
  position?: number
  storyPoints?: number
  labels?: string[]
}

// Kanban Board Types
export interface KanbanColumn {
  id: string
  title: string
  status: TaskStatus
  tasks: Task[]
  color?: string
}

export interface KanbanBoard {
  columns: KanbanColumn[]
  projectId: string
}

// Filter Types
export interface TaskFilters {
  status?: TaskStatus[]
  priority?: TaskPriority[]
  assigneeIds?: string[]
  labels?: string[]
  dueDateRange?: {
    start?: string
    end?: string
  }
  search?: string
}

export interface ProjectFilters {
  status?: ProjectStatus[]
  priority?: ProjectPriority[]
  ownerIds?: string[]
  isArchived?: boolean
  search?: string
}

// Analytics Types
export interface ProjectAnalytics {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalTasks: number
  completedTasks: number
  overdueProjects: number
  averageCompletionTime: number
  teamUtilization: number
}

export interface TaskAnalytics {
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  overdueTasks: number
  averageCompletionTime: number
  tasksByPriority: Record<TaskPriority, number>
  tasksByStatus: Record<TaskStatus, number>
}

export interface TimeTrackingAnalytics {
  totalTimeTracked: number
  averageTaskTime: number
  timeByUser: Array<{
    userId: string
    userName: string
    totalMinutes: number
  }>
  timeByProject: Array<{
    projectId: string
    projectName: string
    totalMinutes: number
  }>
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// Database View Types (matching the SQL views)
export interface ProjectStats {
  id: string
  name: string
  status: ProjectStatus
  progressPercentage: number
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  overdueTasks: number
  teamSize: number
  totalTimeMinutes: number
}

export interface UserWorkload {
  id: string
  name: string
  email: string
  assignedTasks: number
  activeTasks: number
  overdueTasks: number
  totalTimeMinutes: number
}