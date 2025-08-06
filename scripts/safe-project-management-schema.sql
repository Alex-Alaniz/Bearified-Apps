-- Safe Project Management Database Schema
-- This version checks for existing tables and adds only what's missing

-- Enable UUID extension (safe to run multiple times)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types only if they don't exist
DO $$ BEGIN
    CREATE TYPE project_status AS ENUM ('planning', 'active', 'on_hold', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_priority AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'done', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_priority AS ENUM ('lowest', 'low', 'medium', 'high', 'highest');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_member_role AS ENUM ('owner', 'manager', 'member', 'viewer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE dependency_type AS ENUM ('finish_to_start', 'start_to_start', 'finish_to_finish', 'start_to_finish');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create the updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create projects table if it doesn't exist
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

-- Create tasks table if it doesn't exist
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

-- Create remaining tables (safe with IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role project_member_role DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(project_id, user_id)
);

CREATE TABLE IF NOT EXISTS task_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_edited BOOLEAN DEFAULT FALSE
);

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

CREATE TABLE IF NOT EXISTS task_dependencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    predecessor_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    successor_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    dependency_type dependency_type DEFAULT 'finish_to_start',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(predecessor_id, successor_id),
    CONSTRAINT no_self_dependency CHECK (predecessor_id != successor_id)
);

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

CREATE TABLE IF NOT EXISTS task_custom_values (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    custom_field_id UUID REFERENCES custom_fields(id) ON DELETE CASCADE,
    value TEXT,
    
    UNIQUE(task_id, custom_field_id)
);

-- Create indexes if they don't exist (PostgreSQL ignores IF NOT EXISTS for indexes, so we use DO blocks)
DO $$ BEGIN
    -- Projects indexes
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'idx_projects_owner_id' AND n.nspname = 'public') THEN
        CREATE INDEX idx_projects_owner_id ON projects(owner_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'idx_projects_status' AND n.nspname = 'public') THEN
        CREATE INDEX idx_projects_status ON projects(status);
    END IF;
    
    -- Tasks indexes
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'idx_tasks_project_id' AND n.nspname = 'public') THEN
        CREATE INDEX idx_tasks_project_id ON tasks(project_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'idx_tasks_assignee_id' AND n.nspname = 'public') THEN
        CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'idx_tasks_status' AND n.nspname = 'public') THEN
        CREATE INDEX idx_tasks_status ON tasks(status);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'idx_tasks_board_column_position' AND n.nspname = 'public') THEN
        CREATE INDEX idx_tasks_board_column_position ON tasks(board_column, position);
    END IF;
END $$;

-- Create triggers if they don't exist
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update task completed_at when status changes to 'done'
CREATE OR REPLACE FUNCTION update_task_completed_at()
RETURNS TRIGGER AS $$
BEGIN
    -- Set completed_at when status changes to 'done'
    IF NEW.status = 'done' AND (OLD.status IS NULL OR OLD.status != 'done') THEN
        NEW.completed_at = NOW();
    -- Clear completed_at when status changes from 'done' to something else
    ELSIF NEW.status != 'done' AND OLD.status = 'done' THEN
        NEW.completed_at = NULL;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

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

DROP TRIGGER IF EXISTS update_project_progress_trigger ON tasks;
CREATE TRIGGER update_project_progress_trigger
    AFTER INSERT OR UPDATE OF status OR DELETE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_project_progress();

-- Enable RLS on all tables (safe to run multiple times)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_dependencies ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and recreate them (to handle updates)
DROP POLICY IF EXISTS projects_select_policy ON projects;
DROP POLICY IF EXISTS projects_insert_policy ON projects;
DROP POLICY IF EXISTS projects_update_policy ON projects;
DROP POLICY IF EXISTS projects_delete_policy ON projects;

DROP POLICY IF EXISTS tasks_select_policy ON tasks;
DROP POLICY IF EXISTS tasks_insert_policy ON tasks;
DROP POLICY IF EXISTS tasks_update_policy ON tasks;
DROP POLICY IF EXISTS tasks_delete_policy ON tasks;

DROP POLICY IF EXISTS project_members_select_policy ON project_members;
DROP POLICY IF EXISTS project_members_insert_policy ON project_members;

DROP POLICY IF EXISTS task_comments_policy ON task_comments;
DROP POLICY IF EXISTS task_attachments_policy ON task_attachments;
DROP POLICY IF EXISTS time_entries_policy ON time_entries;
DROP POLICY IF EXISTS task_dependencies_policy ON task_dependencies;

-- Recreate RLS policies
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

-- Insert sample data only if no projects exist
DO $$
DECLARE
    project_count INTEGER;
    project_uuid UUID;
    user_uuid UUID;
BEGIN
    SELECT COUNT(*) INTO project_count FROM projects;
    
    IF project_count = 0 THEN
        -- Get or create the admin user
        SELECT id INTO user_uuid FROM users WHERE email = 'alex@alexalaniz.com';
        
        IF user_uuid IS NOT NULL THEN
            -- Insert sample project
            INSERT INTO projects (name, description, status, priority, owner_id, color, icon) 
            VALUES (
                'Sample Project Management System',
                'A comprehensive project management dashboard with Kanban boards, task tracking, and team collaboration features.',
                'active',
                'high',
                user_uuid,
                '#10B981',
                'folder-open'
            ) RETURNING id INTO project_uuid;
            
            -- Insert sample tasks
            IF project_uuid IS NOT NULL THEN
                INSERT INTO tasks (title, description, project_id, status, priority, assignee_id, reporter_id, board_column, position, labels) VALUES
                ('Set up database schema', 'Create PostgreSQL tables for projects, tasks, and user management', project_uuid, 'done', 'high', user_uuid, user_uuid, 'done', 1, ARRAY['backend', 'database']),
                ('Implement drag-and-drop Kanban board', 'Add drag-and-drop functionality to the existing Kanban board using @dnd-kit', project_uuid, 'in_progress', 'high', user_uuid, user_uuid, 'in_progress', 1, ARRAY['frontend', 'ui']),
                ('Create task management API', 'Build REST API endpoints for CRUD operations on tasks', project_uuid, 'todo', 'medium', user_uuid, user_uuid, 'todo', 1, ARRAY['backend', 'api']),
                ('Design project dashboard', 'Create comprehensive project overview with analytics and progress tracking', project_uuid, 'todo', 'medium', user_uuid, user_uuid, 'todo', 2, ARRAY['frontend', 'design']),
                ('Implement real-time updates', 'Add WebSocket support for live collaboration features', project_uuid, 'todo', 'low', user_uuid, user_uuid, 'todo', 3, ARRAY['backend', 'realtime']);
            END IF;
        END IF;
    END IF;
END $$;

-- Create helpful views
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

-- Success message
SELECT 'Project Management schema setup completed successfully!' as message;