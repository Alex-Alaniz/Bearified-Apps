-- Project Management Database Schema
-- This schema extends the existing Bearified Apps authentication system

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for projects
CREATE TYPE project_status AS ENUM ('planning', 'active', 'on_hold', 'completed', 'cancelled');
CREATE TYPE project_priority AS ENUM ('low', 'medium', 'high', 'critical');

-- Create enum types for tasks
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'done', 'cancelled');
CREATE TYPE task_priority AS ENUM ('lowest', 'low', 'medium', 'high', 'highest');

-- Create enum types for project members
CREATE TYPE project_member_role AS ENUM ('owner', 'manager', 'member', 'viewer');

-- Create enum types for task dependencies
CREATE TYPE dependency_type AS ENUM ('finish_to_start', 'start_to_start', 'finish_to_finish', 'start_to_finish');

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status project_status DEFAULT 'planning',
    priority project_priority DEFAULT 'medium',
    
    -- Dates
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Progress & Budget
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    budget DECIMAL(10,2),
    
    -- Ownership (references existing users table)
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    organization_id UUID, -- For future multi-tenant support
    
    -- Settings
    is_archived BOOLEAN DEFAULT FALSE,
    is_template BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color
    icon VARCHAR(50) DEFAULT 'folder',
    
    CONSTRAINT projects_dates_check CHECK (start_date IS NULL OR end_date IS NULL OR start_date <= end_date)
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    
    -- Relationships
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    parent_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL, -- For subtasks
    
    -- Status & Priority
    status task_status DEFAULT 'todo',
    priority task_priority DEFAULT 'medium',
    
    -- Assignment (references existing users table)
    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Dates & Time
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Time Tracking
    estimated_hours DECIMAL(5,2) CHECK (estimated_hours >= 0),
    actual_hours DECIMAL(5,2) DEFAULT 0 CHECK (actual_hours >= 0),
    
    -- Kanban Position
    board_column VARCHAR(100) DEFAULT 'todo',
    position INTEGER DEFAULT 0,
    
    -- Story Points (Agile)
    story_points INTEGER CHECK (story_points >= 0),
    
    -- Metadata
    labels TEXT[] DEFAULT ARRAY[]::TEXT[]
);

-- Create project members table
CREATE TABLE IF NOT EXISTS project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role project_member_role DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(project_id, user_id)
);

-- Create task comments table
CREATE TABLE IF NOT EXISTS task_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_edited BOOLEAN DEFAULT FALSE
);

-- Create task attachments table
CREATE TABLE IF NOT EXISTS task_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create time entries table
CREATE TABLE IF NOT EXISTS time_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT time_entries_duration_check CHECK (
        (start_time IS NOT NULL AND end_time IS NOT NULL AND end_time > start_time) OR
        (duration_minutes IS NOT NULL AND duration_minutes > 0)
    )
);

-- Create task dependencies table
CREATE TABLE IF NOT EXISTS task_dependencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    predecessor_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    successor_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    dependency_type dependency_type DEFAULT 'finish_to_start',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(predecessor_id, successor_id),
    CONSTRAINT no_self_dependency CHECK (predecessor_id != successor_id)
);

-- Create project templates table (for future use)
CREATE TABLE IF NOT EXISTS project_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    is_public BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Template data (JSON structure)
    template_data JSONB NOT NULL
);

-- Create custom fields table (for future extensibility)
CREATE TABLE IF NOT EXISTS custom_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    field_type VARCHAR(50) NOT NULL, -- 'text', 'number', 'date', 'dropdown', 'multi_select', 'checkbox'
    field_options JSONB, -- For dropdown/multi-select options
    is_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(project_id, field_name)
);

-- Create task custom values table
CREATE TABLE IF NOT EXISTS task_custom_values (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    custom_field_id UUID REFERENCES custom_fields(id) ON DELETE CASCADE,
    value TEXT,
    
    UNIQUE(task_id, custom_field_id)
);

-- Create indexes for performance

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_is_archived ON projects(is_archived);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- Tasks indexes
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_reporter_id ON tasks(reporter_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_board_column_position ON tasks(board_column, position);
CREATE INDEX IF NOT EXISTS idx_tasks_parent_task_id ON tasks(parent_task_id);

-- Project members indexes
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON project_members(user_id);
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_members(project_id);

-- Task comments indexes
CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_comments_user_id ON task_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_task_comments_created_at ON task_comments(created_at);

-- Task attachments indexes
CREATE INDEX IF NOT EXISTS idx_task_attachments_task_id ON task_attachments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_attachments_user_id ON task_attachments(user_id);

-- Time entries indexes
CREATE INDEX IF NOT EXISTS idx_time_entries_task_id ON time_entries(task_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_user_id ON time_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_start_time ON time_entries(start_time);

-- Task dependencies indexes
CREATE INDEX IF NOT EXISTS idx_task_dependencies_predecessor ON task_dependencies(predecessor_id);
CREATE INDEX IF NOT EXISTS idx_task_dependencies_successor ON task_dependencies(successor_id);

-- Custom fields indexes
CREATE INDEX IF NOT EXISTS idx_custom_fields_project_id ON custom_fields(project_id);
CREATE INDEX IF NOT EXISTS idx_task_custom_values_task_id ON task_custom_values(task_id);

-- Create updated_at triggers for tables that need them

-- Projects trigger
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Tasks trigger
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Task comments trigger
DROP TRIGGER IF EXISTS update_task_comments_updated_at ON task_comments;
CREATE TRIGGER update_task_comments_updated_at
    BEFORE UPDATE ON task_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update task completed_at when status changes to 'done'
CREATE OR REPLACE FUNCTION update_task_completed_at()
RETURNS TRIGGER AS $$
BEGIN
    -- Set completed_at when status changes to 'done'
    IF NEW.status = 'done' AND OLD.status != 'done' THEN
        NEW.completed_at = NOW();
    -- Clear completed_at when status changes from 'done' to something else
    ELSIF NEW.status != 'done' AND OLD.status = 'done' THEN
        NEW.completed_at = NULL;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for automatic completed_at updates
DROP TRIGGER IF EXISTS update_task_completed_at_trigger ON tasks;
CREATE TRIGGER update_task_completed_at_trigger
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_task_completed_at();

-- Function to automatically update project progress based on completed tasks
CREATE OR REPLACE FUNCTION update_project_progress()
RETURNS TRIGGER AS $$
DECLARE
    project_id_val UUID;
    total_tasks INTEGER;
    completed_tasks INTEGER;
    progress_pct INTEGER;
BEGIN
    -- Get the project ID from the task
    IF TG_OP = 'DELETE' THEN
        project_id_val := OLD.project_id;
    ELSE
        project_id_val := NEW.project_id;
    END IF;
    
    -- Count total and completed tasks for the project
    SELECT COUNT(*), COUNT(CASE WHEN status = 'done' THEN 1 END)
    INTO total_tasks, completed_tasks
    FROM tasks
    WHERE project_id = project_id_val AND parent_task_id IS NULL; -- Only count top-level tasks
    
    -- Calculate progress percentage
    IF total_tasks = 0 THEN
        progress_pct := 0;
    ELSE
        progress_pct := ROUND((completed_tasks::DECIMAL / total_tasks::DECIMAL) * 100);
    END IF;
    
    -- Update the project progress
    UPDATE projects 
    SET progress_percentage = progress_pct, updated_at = NOW()
    WHERE id = project_id_val;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Create trigger for automatic project progress updates
DROP TRIGGER IF EXISTS update_project_progress_trigger ON tasks;
CREATE TRIGGER update_project_progress_trigger
    AFTER INSERT OR UPDATE OF status OR DELETE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_project_progress();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_dependencies ENABLE ROW LEVEL SECURITY;

-- Projects RLS policies
CREATE POLICY projects_select_policy ON projects FOR SELECT TO authenticated
USING (
    owner_id = auth.uid() OR 
    id IN (
        SELECT project_id FROM project_members 
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY projects_insert_policy ON projects FOR INSERT TO authenticated
WITH CHECK (owner_id = auth.uid());

CREATE POLICY projects_update_policy ON projects FOR UPDATE TO authenticated
USING (
    owner_id = auth.uid() OR 
    id IN (
        SELECT project_id FROM project_members 
        WHERE user_id = auth.uid() AND role IN ('owner', 'manager')
    )
);

CREATE POLICY projects_delete_policy ON projects FOR DELETE TO authenticated
USING (owner_id = auth.uid());

-- Tasks RLS policies
CREATE POLICY tasks_select_policy ON tasks FOR SELECT TO authenticated
USING (
    project_id IN (
        SELECT id FROM projects 
        WHERE owner_id = auth.uid() OR 
        id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
    )
);

CREATE POLICY tasks_insert_policy ON tasks FOR INSERT TO authenticated
WITH CHECK (
    project_id IN (
        SELECT id FROM projects 
        WHERE owner_id = auth.uid() OR 
        id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
    )
);

CREATE POLICY tasks_update_policy ON tasks FOR UPDATE TO authenticated
USING (
    project_id IN (
        SELECT id FROM projects 
        WHERE owner_id = auth.uid() OR 
        id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
    )
);

CREATE POLICY tasks_delete_policy ON tasks FOR DELETE TO authenticated
USING (
    project_id IN (
        SELECT id FROM projects 
        WHERE owner_id = auth.uid() OR 
        id IN (
            SELECT project_id FROM project_members 
            WHERE user_id = auth.uid() AND role IN ('owner', 'manager')
        )
    )
);

-- Project members RLS policies
CREATE POLICY project_members_select_policy ON project_members FOR SELECT TO authenticated
USING (
    user_id = auth.uid() OR
    project_id IN (
        SELECT id FROM projects WHERE owner_id = auth.uid()
    )
);

CREATE POLICY project_members_insert_policy ON project_members FOR INSERT TO authenticated
WITH CHECK (
    project_id IN (
        SELECT id FROM projects 
        WHERE owner_id = auth.uid() OR 
        id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid() AND role IN ('owner', 'manager'))
    )
);

-- Task comments, attachments, and time entries inherit permissions from tasks
CREATE POLICY task_comments_policy ON task_comments FOR ALL TO authenticated
USING (
    task_id IN (
        SELECT id FROM tasks WHERE
        project_id IN (
            SELECT id FROM projects 
            WHERE owner_id = auth.uid() OR 
            id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
        )
    )
);

CREATE POLICY task_attachments_policy ON task_attachments FOR ALL TO authenticated
USING (
    task_id IN (
        SELECT id FROM tasks WHERE
        project_id IN (
            SELECT id FROM projects 
            WHERE owner_id = auth.uid() OR 
            id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
        )
    )
);

CREATE POLICY time_entries_policy ON time_entries FOR ALL TO authenticated
USING (
    task_id IN (
        SELECT id FROM tasks WHERE
        project_id IN (
            SELECT id FROM projects 
            WHERE owner_id = auth.uid() OR 
            id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
        )
    )
);

-- Task dependencies policy
CREATE POLICY task_dependencies_policy ON task_dependencies FOR ALL TO authenticated
USING (
    predecessor_id IN (
        SELECT id FROM tasks WHERE
        project_id IN (
            SELECT id FROM projects 
            WHERE owner_id = auth.uid() OR 
            id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
        )
    )
);

-- Insert sample data for development

-- Sample project
INSERT INTO projects (name, description, status, priority, owner_id, color, icon) 
SELECT 
    'Sample Project Management System',
    'A comprehensive project management dashboard with Kanban boards, task tracking, and team collaboration features.',
    'active',
    'high',
    u.id,
    '#10B981',
    'folder-open'
FROM users u 
WHERE u.email = 'alex@alexalaniz.com'
ON CONFLICT DO NOTHING;

-- Sample tasks for the project
DO $$
DECLARE
    project_uuid UUID;
    user_uuid UUID;
BEGIN
    -- Get the project and user IDs
    SELECT id INTO project_uuid FROM projects WHERE name = 'Sample Project Management System';
    SELECT id INTO user_uuid FROM users WHERE email = 'alex@alexalaniz.com';
    
    IF project_uuid IS NOT NULL AND user_uuid IS NOT NULL THEN
        -- Insert sample tasks
        INSERT INTO tasks (title, description, project_id, status, priority, assignee_id, reporter_id, board_column, position, labels) VALUES
        ('Set up database schema', 'Create PostgreSQL tables for projects, tasks, and user management', project_uuid, 'done', 'high', user_uuid, user_uuid, 'done', 1, ARRAY['backend', 'database']),
        ('Implement drag-and-drop Kanban board', 'Add drag-and-drop functionality to the existing Kanban board using @dnd-kit', project_uuid, 'in_progress', 'high', user_uuid, user_uuid, 'in_progress', 1, ARRAY['frontend', 'ui']),
        ('Create task management API', 'Build REST API endpoints for CRUD operations on tasks', project_uuid, 'todo', 'medium', user_uuid, user_uuid, 'todo', 1, ARRAY['backend', 'api']),
        ('Design project dashboard', 'Create comprehensive project overview with analytics and progress tracking', project_uuid, 'todo', 'medium', user_uuid, user_uuid, 'todo', 2, ARRAY['frontend', 'design']),
        ('Implement real-time updates', 'Add WebSocket support for live collaboration features', project_uuid, 'todo', 'low', user_uuid, user_uuid, 'todo', 3, ARRAY['backend', 'realtime']);
    END IF;
END $$;

-- Create a view for project statistics
CREATE OR REPLACE VIEW project_stats AS
SELECT 
    p.id,
    p.name,
    p.status,
    p.progress_percentage,
    COUNT(t.id) as total_tasks,
    COUNT(CASE WHEN t.status = 'done' THEN 1 END) as completed_tasks,
    COUNT(CASE WHEN t.status = 'in_progress' THEN 1 END) as in_progress_tasks,
    COUNT(CASE WHEN t.due_date < NOW() AND t.status != 'done' THEN 1 END) as overdue_tasks,
    COUNT(DISTINCT pm.user_id) as team_size,
    COALESCE(SUM(te.duration_minutes), 0) as total_time_minutes
FROM projects p
LEFT JOIN tasks t ON p.id = t.project_id AND t.parent_task_id IS NULL
LEFT JOIN project_members pm ON p.id = pm.project_id
LEFT JOIN time_entries te ON t.id = te.task_id
GROUP BY p.id, p.name, p.status, p.progress_percentage;

-- Create a view for user workload
CREATE OR REPLACE VIEW user_workload AS
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(t.id) as assigned_tasks,
    COUNT(CASE WHEN t.status != 'done' THEN 1 END) as active_tasks,
    COUNT(CASE WHEN t.due_date < NOW() AND t.status != 'done' THEN 1 END) as overdue_tasks,
    COALESCE(SUM(te.duration_minutes), 0) as total_time_minutes
FROM users u
LEFT JOIN tasks t ON u.id = t.assignee_id
LEFT JOIN time_entries te ON t.id = te.task_id AND te.user_id = u.id
GROUP BY u.id, u.name, u.email;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;