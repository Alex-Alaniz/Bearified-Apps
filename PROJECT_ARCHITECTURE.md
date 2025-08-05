# Project Management Dashboard - Architecture & Data Models

## System Architecture Overview

### Frontend Architecture (Next.js 14)
```
app/
├── dashboard/
│   ├── projects/
│   │   ├── page.tsx                    # Main projects dashboard
│   │   ├── [id]/
│   │   │   ├── page.tsx               # Individual project view
│   │   │   ├── kanban/page.tsx        # Project kanban board
│   │   │   ├── calendar/page.tsx      # Project calendar
│   │   │   ├── analytics/page.tsx     # Project analytics
│   │   │   └── settings/page.tsx      # Project settings
│   │   ├── new/page.tsx               # Create new project
│   │   └── components/
│   │       ├── kanban-board.tsx       # Enhanced kanban component
│   │       ├── task-card.tsx          # Individual task display
│   │       ├── task-modal.tsx         # Task create/edit modal
│   │       ├── project-header.tsx     # Project info header
│   │       └── filters.tsx            # Filtering components
│   └── reports/
│       ├── page.tsx                   # Reports dashboard
│       ├── time-tracking/page.tsx     # Time reports
│       └── analytics/page.tsx         # Analytics reports

components/
├── project-management/
│   ├── kanban/                        # Kanban-specific components
│   ├── calendar/                      # Calendar components  
│   ├── forms/                         # Task/project forms
│   ├── charts/                        # Analytics charts
│   └── shared/                        # Reusable PM components

lib/
├── database/
│   ├── projects.ts                    # Project CRUD operations
│   ├── tasks.ts                       # Task CRUD operations
│   ├── users.ts                       # User management
│   └── analytics.ts                   # Analytics queries
├── hooks/
│   ├── use-projects.ts                # Project state management
│   ├── use-tasks.ts                   # Task state management
│   └── use-realtime.ts                # WebSocket hooks
└── types/
    ├── project.ts                     # Project type definitions
    ├── task.ts                        # Task type definitions
    └── analytics.ts                   # Analytics types
```

## Database Schema (Supabase PostgreSQL)

### Core Tables

#### 1. Projects Table
```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status project_status DEFAULT 'planning',
  priority project_priority DEFAULT 'medium',
  
  -- Dates
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Progress & Budget
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  budget DECIMAL(10,2),
  
  -- Ownership
  owner_id UUID REFERENCES auth.users(id),
  organization_id UUID, -- For multi-tenant support
  
  -- Settings
  is_archived BOOLEAN DEFAULT FALSE,
  is_template BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color
  icon VARCHAR(50) DEFAULT 'folder',
  
  CONSTRAINT projects_dates_check CHECK (start_date <= end_date)
);

-- Enums
CREATE TYPE project_status AS ENUM ('planning', 'active', 'on_hold', 'completed', 'cancelled');
CREATE TYPE project_priority AS ENUM ('low', 'medium', 'high', 'critical');
```

#### 2. Tasks Table
```sql
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  
  -- Relationships
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  parent_task_id UUID REFERENCES tasks(id), -- For subtasks
  
  -- Status & Priority
  status task_status DEFAULT 'todo',
  priority task_priority DEFAULT 'medium',
  
  -- Assignment
  assignee_id UUID REFERENCES auth.users(id),
  reporter_id UUID REFERENCES auth.users(id),
  
  -- Dates & Time
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  due_date TIMESTAMP,
  completed_at TIMESTAMP,
  
  -- Time Tracking
  estimated_hours DECIMAL(5,2),
  actual_hours DECIMAL(5,2) DEFAULT 0,
  
  -- Kanban Position
  board_column VARCHAR(100) DEFAULT 'todo',
  position INTEGER DEFAULT 0,
  
  -- Story Points (Agile)
  story_points INTEGER,
  
  -- Metadata
  labels TEXT[], -- Array of label strings
  
  CONSTRAINT tasks_hours_check CHECK (estimated_hours >= 0 AND actual_hours >= 0)
);

-- Enums
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'done', 'cancelled');
CREATE TYPE task_priority AS ENUM ('lowest', 'low', 'medium', 'high', 'highest');
```

#### 3. Project Members Table
```sql
CREATE TABLE project_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role project_member_role DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(project_id, user_id)
);

CREATE TYPE project_member_role AS ENUM ('owner', 'manager', 'member', 'viewer');
```

#### 4. Task Comments Table
```sql
CREATE TABLE task_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_edited BOOLEAN DEFAULT FALSE
);
```

#### 5. Task Attachments Table
```sql
CREATE TABLE task_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 6. Time Entries Table
```sql
CREATE TABLE time_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  description TEXT,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  duration_minutes INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT time_entries_duration_check CHECK (
    (start_time IS NOT NULL AND end_time IS NOT NULL AND end_time > start_time) OR
    (duration_minutes IS NOT NULL AND duration_minutes > 0)
  )
);
```

#### 7. Task Dependencies Table
```sql
CREATE TABLE task_dependencies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  predecessor_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  successor_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  dependency_type dependency_type DEFAULT 'finish_to_start',
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(predecessor_id, successor_id),
  CONSTRAINT no_self_dependency CHECK (predecessor_id != successor_id)
);

CREATE TYPE dependency_type AS ENUM ('finish_to_start', 'start_to_start', 'finish_to_finish', 'start_to_finish');
```

### Extended Tables

#### 8. Project Templates Table
```sql
CREATE TABLE project_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  is_public BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Template data (JSON structure)
  template_data JSONB NOT NULL
);
```

#### 9. Custom Fields Table
```sql
CREATE TABLE custom_fields (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  field_name VARCHAR(100) NOT NULL,
  field_type custom_field_type NOT NULL,
  field_options JSONB, -- For dropdown/multi-select options
  is_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(project_id, field_name)
);

CREATE TYPE custom_field_type AS ENUM ('text', 'number', 'date', 'dropdown', 'multi_select', 'checkbox');
```

#### 10. Task Custom Values Table
```sql
CREATE TABLE task_custom_values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  custom_field_id UUID REFERENCES custom_fields(id) ON DELETE CASCADE,
  value TEXT,
  
  UNIQUE(task_id, custom_field_id)
);
```

## TypeScript Type Definitions

### Core Types
```typescript
// lib/types/project.ts
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
  
  // Computed/joined fields
  owner?: User
  members?: ProjectMember[]
  taskCount?: number
  completedTaskCount?: number
}

export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'
export type ProjectPriority = 'low' | 'medium' | 'high' | 'critical'

// lib/types/task.ts
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
  
  // Computed/joined fields
  project?: Project
  assignee?: User
  reporter?: User
  comments?: TaskComment[]
  attachments?: TaskAttachment[]
  timeEntries?: TimeEntry[]
  subtasks?: Task[]
  dependencies?: TaskDependency[]
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled'
export type TaskPriority = 'lowest' | 'low' | 'medium' | 'high' | 'highest'
```

## API Structure (Next.js App Router)

### API Routes
```
app/api/
├── projects/
│   ├── route.ts                      # GET /api/projects, POST /api/projects
│   ├── [id]/
│   │   ├── route.ts                  # GET/PUT/DELETE /api/projects/[id]
│   │   ├── tasks/route.ts            # GET/POST /api/projects/[id]/tasks
│   │   ├── members/route.ts          # GET/POST /api/projects/[id]/members
│   │   └── analytics/route.ts        # GET /api/projects/[id]/analytics
├── tasks/
│   ├── route.ts                      # GET /api/tasks, POST /api/tasks
│   ├── [id]/
│   │   ├── route.ts                  # GET/PUT/DELETE /api/tasks/[id]
│   │   ├── comments/route.ts         # GET/POST /api/tasks/[id]/comments
│   │   ├── attachments/route.ts      # GET/POST /api/tasks/[id]/attachments
│   │   └── time-entries/route.ts     # GET/POST /api/tasks/[id]/time-entries
├── users/
│   └── route.ts                      # GET /api/users (for assignment dropdowns)
└── analytics/
    ├── projects/route.ts             # Project analytics
    ├── time-tracking/route.ts        # Time tracking reports
    └── dashboard/route.ts            # Dashboard metrics
```

## State Management Architecture

### React Context + Custom Hooks
```typescript
// lib/contexts/project-context.tsx
export interface ProjectContextType {
  projects: Project[]
  currentProject?: Project
  loading: boolean
  error?: string
  
  // Actions
  createProject: (data: CreateProjectData) => Promise<Project>
  updateProject: (id: string, data: UpdateProjectData) => Promise<Project>
  deleteProject: (id: string) => Promise<void>
  setCurrentProject: (project: Project) => void
}

// lib/hooks/use-projects.ts
export function useProjects() {
  // SWR or React Query for data fetching
  // Returns CRUD operations and caching
}

// lib/hooks/use-realtime.ts
export function useRealtime(projectId: string) {
  // Supabase realtime subscriptions
  // WebSocket connections for live updates
}
```

## Real-time Architecture

### Supabase Realtime Integration
```typescript
// lib/realtime/project-updates.ts
export class ProjectRealtimeManager {
  private supabase = createClient()
  private subscriptions: Map<string, RealtimeChannel> = new Map()

  subscribeToProject(projectId: string, callbacks: {
    onTaskUpdate?: (payload: any) => void
    onCommentAdded?: (payload: any) => void
    onMemberJoined?: (payload: any) => void
  }) {
    const channel = this.supabase
      .channel(`project:${projectId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'tasks',
        filter: `project_id=eq.${projectId}`
      }, callbacks.onTaskUpdate)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public', 
        table: 'task_comments',
        filter: `task.project_id=eq.${projectId}`
      }, callbacks.onCommentAdded)
      .subscribe()

    this.subscriptions.set(projectId, channel)
  }
}
```

## Security & Permissions

### Row Level Security (RLS) Policies
```sql
-- Projects RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY projects_select_policy ON projects FOR SELECT TO authenticated
USING (
  owner_id = auth.uid() OR 
  id IN (
    SELECT project_id FROM project_members 
    WHERE user_id = auth.uid()
  )
);

-- Tasks RLS  
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY tasks_select_policy ON tasks FOR SELECT TO authenticated
USING (
  project_id IN (
    SELECT id FROM projects 
    WHERE owner_id = auth.uid() OR 
    id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
  )
);
```

## Performance Considerations

### Database Indexing
```sql
-- Indexes for performance
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_board_column_position ON tasks(board_column, position);
CREATE INDEX idx_project_members_user_id ON project_members(user_id);
CREATE INDEX idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX idx_time_entries_task_id ON time_entries(task_id);
CREATE INDEX idx_time_entries_user_id ON time_entries(user_id);
```

### Caching Strategy
- **SWR/React Query**: Client-side caching with stale-while-revalidate
- **Redis**: Server-side caching for analytics and reports (future)
- **Supabase Edge Caching**: Built-in CDN caching

## Mobile Considerations

### Progressive Web App (PWA)
- Service worker for offline functionality
- App manifest for install prompts
- Push notifications for task updates

### React Native Integration
- Shared API endpoints
- Consistent data models
- Cross-platform state management

This architecture provides a scalable foundation for a comprehensive project management system that can grow from MVP to enterprise-level functionality.