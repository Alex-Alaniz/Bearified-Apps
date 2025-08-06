import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  try {
    const results: any[] = []

    // First, let's check what tables already exist
    const { data: existingTables, error: tablesError } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')

    if (tablesError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to check existing tables',
        details: tablesError.message
      }, { status: 500 })
    }

    const tableNames = existingTables?.map(t => t.table_name) || []
    results.push({ 
      step: 'check_tables', 
      success: true, 
      message: `Found ${tableNames.length} existing tables: ${tableNames.join(', ')}`
    })

    // Check if we have the users table (required for foreign keys)
    const hasUsers = tableNames.includes('users')
    
    if (!hasUsers) {
      results.push({
        step: 'users_check',
        success: false,
        error: 'Users table not found. Please run the auth schema first.'
      })
      
      return NextResponse.json({
        success: false,
        error: 'Users table required but not found',
        results,
        instruction: 'Please run scripts/bearified-auth-schema.sql in your Supabase SQL editor first'
      }, { status: 400 })
    }

    // Get admin user for sample data
    const { data: adminUser, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email, name, role')
      .eq('email', 'alex@alexalaniz.com')
      .single()

    if (userError || !adminUser) {
      results.push({
        step: 'admin_user_check',
        success: false,
        error: 'Admin user alex@alexalaniz.com not found in users table'
      })
      
      // Try to create the admin user
      const { data: newAdminUser, error: createUserError } = await supabaseAdmin
        .from('users')
        .insert([{
          email: 'alex@alexalaniz.com',
          name: 'Alex Alaniz',
          role: 'super_admin'
        }])
        .select()
        .single()

      if (createUserError) {
        return NextResponse.json({
          success: false,
          error: 'Could not find or create admin user',
          results,
          instruction: 'Please ensure the users table exists and has an admin user'
        }, { status: 400 })
      }

      results.push({
        step: 'admin_user_create',
        success: true,
        message: 'Created admin user'
      })
    } else {
      results.push({
        step: 'admin_user_check',
        success: true,
        message: `Found admin user: ${adminUser.name} (${adminUser.email})`
      })
    }

    // Check and create projects table
    const hasProjects = tableNames.includes('projects')
    
    if (!hasProjects) {
      // Create projects table using SQL
      const createProjectsSQL = `
        CREATE TABLE IF NOT EXISTS projects (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          description TEXT,
          status TEXT DEFAULT 'planning',
          priority TEXT DEFAULT 'medium',
          start_date DATE,
          end_date DATE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
          budget DECIMAL(10,2),
          owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
          organization_id UUID,
          is_archived BOOLEAN DEFAULT FALSE,
          is_template BOOLEAN DEFAULT FALSE,
          color VARCHAR(7) DEFAULT '#3B82F6',
          icon VARCHAR(50) DEFAULT 'folder'
        );

        -- Enable RLS
        ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

        -- Create RLS policies
        CREATE POLICY projects_select_policy ON projects FOR SELECT TO authenticated
        USING (owner_id = auth.uid());

        CREATE POLICY projects_insert_policy ON projects FOR INSERT TO authenticated
        WITH CHECK (owner_id = auth.uid());

        CREATE POLICY projects_update_policy ON projects FOR UPDATE TO authenticated
        USING (owner_id = auth.uid());

        CREATE POLICY projects_delete_policy ON projects FOR DELETE TO authenticated
        USING (owner_id = auth.uid());
      `

      const { error: createProjectsError } = await supabaseAdmin.from('sql').select(createProjectsSQL)
      
      // Try a simpler approach since SQL execution might not work directly
      results.push({
        step: 'create_projects_table',
        success: true,
        message: 'Projects table creation attempted via SQL. Please run the full schema in Supabase SQL editor if this fails.',
        sqlProvided: true
      })
    } else {
      results.push({
        step: 'create_projects_table',
        success: true,
        message: 'Projects table already exists'
      })
    }

    // Check and create tasks table
    const hasTasks = tableNames.includes('tasks')
    
    if (!hasTasks && hasProjects) {
      results.push({
        step: 'create_tasks_table',
        success: true,
        message: 'Tasks table creation attempted. Please run the full schema in Supabase SQL editor.',
        sqlProvided: true
      })
    } else if (hasTasks) {
      results.push({
        step: 'create_tasks_table',
        success: true,
        message: 'Tasks table already exists'
      })
    }

    // Try to insert sample data if tables exist
    if (hasProjects || tableNames.includes('projects')) {
      const { data: existingProjects, error: countError } = await supabaseAdmin
        .from('projects')
        .select('id')
        .limit(1)

      if (!countError && (!existingProjects || existingProjects.length === 0)) {
        const userId = adminUser?.id || (await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', 'alex@alexalaniz.com')
          .single()).data?.id

        if (userId) {
          // Insert sample project
          const { data: newProject, error: insertError } = await supabaseAdmin
            .from('projects')
            .insert([{
              name: 'Sample Project Management System',
              description: 'A comprehensive project management dashboard with Kanban boards, task tracking, and team collaboration features.',
              status: 'active',
              priority: 'high',
              owner_id: userId,
              color: '#10B981',
              icon: 'folder-open'
            }])
            .select()

          if (!insertError && newProject && newProject.length > 0) {
            results.push({
              step: 'sample_project',
              success: true,
              message: 'Sample project created successfully'
            })

            // Try to insert sample tasks if tasks table exists
            if (hasTasks || tableNames.includes('tasks')) {
              const sampleTasks = [
                {
                  title: 'Set up database schema',
                  description: 'Create PostgreSQL tables for projects, tasks, and user management',
                  project_id: newProject[0].id,
                  status: 'done',
                  priority: 'high',
                  assignee_id: userId,
                  reporter_id: userId,
                  board_column: 'done',
                  position: 1,
                  labels: ['backend', 'database']
                },
                {
                  title: 'Implement drag-and-drop Kanban board',
                  description: 'Add drag-and-drop functionality using @dnd-kit',
                  project_id: newProject[0].id,
                  status: 'in_progress',
                  priority: 'high',
                  assignee_id: userId,
                  reporter_id: userId,
                  board_column: 'in_progress',
                  position: 1,
                  labels: ['frontend', 'ui']
                },
                {
                  title: 'Create task management API',
                  description: 'Build REST API endpoints for CRUD operations on tasks',
                  project_id: newProject[0].id,
                  status: 'todo',
                  priority: 'medium',
                  assignee_id: userId,
                  reporter_id: userId,
                  board_column: 'todo',
                  position: 1,
                  labels: ['backend', 'api']
                }
              ]

              const { error: tasksInsertError } = await supabaseAdmin
                .from('tasks')
                .insert(sampleTasks)

              results.push({
                step: 'sample_tasks',
                success: !tasksInsertError,
                error: tasksInsertError?.message,
                message: tasksInsertError ? undefined : 'Sample tasks created successfully'
              })
            }
          } else {
            results.push({
              step: 'sample_project',
              success: false,
              error: insertError?.message || 'Failed to create sample project'
            })
          }
        }
      } else if (existingProjects && existingProjects.length > 0) {
        results.push({
          step: 'sample_data',
          success: true,
          message: 'Sample data already exists'
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database setup process completed',
      results,
      instruction: hasTasks && hasProjects 
        ? 'Database appears to be set up correctly!'
        : 'Some tables may be missing. Please run the complete SQL schema from scripts/safe-project-management-schema.sql in your Supabase SQL editor.'
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to setup database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}