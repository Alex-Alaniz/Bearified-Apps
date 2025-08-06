import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  try {
    // First, clear existing sample data to avoid conflicts
    await supabase.from('tasks').delete().neq('id', 'non-existent')
    await supabase.from('projects').delete().neq('id', 'non-existent')

    // Insert business projects
    const projects = [
      // SoleBrew Projects
      {
        id: 'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5g6h7',
        name: 'SoleBrew MVP - Core Coffee Shop Management',
        description: 'Build the minimum viable product for coffee shop owners to manage inventory, sales, and customer data. Focus on essential features that solve immediate pain points.',
        status: 'active',
        priority: 'high',
        start_date: '2024-01-15',
        end_date: '2024-04-15',
        progress_percentage: 35,
        color: '#F59E0B',
        icon: 'coffee'
      },
      {
        id: 'b2c3d4e5-f6a7-4890-b1c2-d3e4f5a6b7c8',
        name: 'SoleBrew Analytics Dashboard',
        description: 'Develop comprehensive analytics and reporting dashboard for coffee shop owners to track sales trends, inventory levels, and customer insights.',
        status: 'planning',
        priority: 'medium',
        start_date: '2024-03-01',
        end_date: '2024-06-30',
        progress_percentage: 0,
        color: '#F59E0B',
        icon: 'chart-bar'
      },
      {
        id: 'c3d4e5f6-a7b8-4901-c2d3-e4f5a6b7c8d9',
        name: 'SoleBrew Multi-Location Support',
        description: 'Extend the platform to support franchise operations and multiple coffee shop locations with centralized management.',
        status: 'planning',
        priority: 'medium',
        start_date: '2024-06-01',
        end_date: '2024-10-31',
        progress_percentage: 0,
        color: '#F59E0B',
        icon: 'building-store'
      },
      // Chimpanion Projects
      {
        id: 'd4e5f6a7-b8c9-4012-d3e4-f5a6b7c8d9e0',
        name: 'Chimpanion Core Security Platform',
        description: 'Develop the foundational security monitoring and threat detection platform with real-time analysis capabilities.',
        status: 'active',
        priority: 'critical',
        start_date: '2024-01-01',
        end_date: '2024-05-31',
        progress_percentage: 60,
        color: '#10B981',
        icon: 'shield'
      },
      {
        id: 'e5f6a7b8-c9d0-4123-e4f5-a6b7c8d9e0f1',
        name: 'Chimpanion Business Intelligence Integration',
        description: 'Build comprehensive business intelligence tools that integrate security data with business metrics for actionable insights.',
        status: 'planning',
        priority: 'high',
        start_date: '2024-04-01',
        end_date: '2024-08-15',
        progress_percentage: 0,
        color: '#10B981',
        icon: 'analytics'
      },
      {
        id: 'f6a7b8c9-d0e1-4234-f5a6-b7c8d9e0f1a2',
        name: 'Chimpanion Mobile App',
        description: 'Develop mobile application for security monitoring and alerts with push notifications and real-time dashboards.',
        status: 'planning',
        priority: 'medium',
        start_date: '2024-05-15',
        end_date: '2024-09-30',
        progress_percentage: 0,
        color: '#10B981',
        icon: 'smartphone'
      },
      // Platform Projects
      {
        id: 'a7b8c9d0-e1f2-4345-a6b7-c8d9e0f1a2b3',
        name: 'Unified Authentication System',
        description: 'Complete the Privy-based authentication system with role-based access control and multi-app support.',
        status: 'active',
        priority: 'critical',
        start_date: '2024-01-01',
        end_date: '2024-02-29',
        progress_percentage: 95,
        color: '#6366F1',
        icon: 'key'
      },
      {
        id: 'b8c9d0e1-f2a3-4456-b7c8-d9e0f1a2b3c4',
        name: 'Admin Panel Enhancement',
        description: 'Enhance the admin panel with user management, app configuration, and system monitoring capabilities.',
        status: 'active',
        priority: 'high',
        start_date: '2024-02-01',
        end_date: '2024-03-31',
        progress_percentage: 25,
        color: '#6366F1',
        icon: 'settings'
      },
      {
        id: 'c9d0e1f2-a3b4-4567-c8d9-e0f1a2b3c4d5',
        name: 'Project Management System',
        description: 'Build comprehensive project management tools with Kanban boards, task tracking, and team collaboration.',
        status: 'active',
        priority: 'high',
        start_date: '2024-01-15',
        end_date: '2024-04-30',
        progress_percentage: 70,
        color: '#6366F1',
        icon: 'kanban-square'
      }
    ]

    // Insert projects
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert(projects)

    if (projectError) {
      throw new Error(`Failed to insert projects: ${projectError.message}`)
    }

    // Insert sample tasks
    const tasks = [
      // SoleBrew MVP Tasks
      {
        id: 'task-001',
        title: 'Design inventory management UI',
        description: 'Create user interface designs for inventory tracking, stock alerts, and supplier management.',
        status: 'done',
        priority: 'high',
        project_id: 'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5g6h7',
        column_id: 'done',
        position: 1,
      },
      {
        id: 'task-002',
        title: 'Implement sales tracking backend',
        description: 'Build API endpoints for recording sales transactions and generating daily/weekly reports.',
        status: 'in_progress',
        priority: 'high',
        project_id: 'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5g6h7',
        column_id: 'in_progress',
        position: 1,
      },
      {
        id: 'task-003',
        title: 'Customer loyalty program',
        description: 'Design and implement customer rewards system with points and tier-based benefits.',
        status: 'todo',
        priority: 'medium',
        project_id: 'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5g6h7',
        column_id: 'todo',
        position: 1,
      },
      // Chimpanion Security Platform Tasks
      {
        id: 'task-004',
        title: 'Real-time threat detection engine',
        description: 'Implement machine learning algorithms for identifying security threats in real-time data streams.',
        status: 'in_progress',
        priority: 'critical',
        project_id: 'd4e5f6a7-b8c9-4012-d3e4-f5a6b7c8d9e0',
        column_id: 'in_progress',
        position: 1,
      },
      {
        id: 'task-005',
        title: 'Security dashboard UI',
        description: 'Build comprehensive security monitoring dashboard with customizable widgets and alerts.',
        status: 'done',
        priority: 'high',
        project_id: 'd4e5f6a7-b8c9-4012-d3e4-f5a6b7c8d9e0',
        column_id: 'done',
        position: 1,
      },
      // Platform Enhancement Tasks
      {
        id: 'task-006',
        title: 'Role-based access control',
        description: 'Implement granular permissions system with role inheritance and app-specific access.',
        status: 'done',
        priority: 'critical',
        project_id: 'a7b8c9d0-e1f2-4345-a6b7-c8d9e0f1a2b3',
        column_id: 'done',
        position: 1,
      },
      {
        id: 'task-007',
        title: 'User management interface',
        description: 'Build admin interface for managing users, roles, and app permissions.',
        status: 'in_progress',
        priority: 'high',
        project_id: 'b8c9d0e1-f2a3-4456-b7c8-d9e0f1a2b3c4',
        column_id: 'in_progress',
        position: 1,
      },
      {
        id: 'task-008',
        title: 'Drag-and-drop Kanban board',
        description: 'Implement interactive Kanban board with drag-and-drop task management using @dnd-kit.',
        status: 'done',
        priority: 'high',
        project_id: 'c9d0e1f2-a3b4-4567-c8d9-e0f1a2b3c4d5',
        column_id: 'done',
        position: 1,
      }
    ]

    // Insert tasks
    const { data: taskData, error: taskError } = await supabase
      .from('tasks')
      .insert(tasks)

    if (taskError) {
      throw new Error(`Failed to insert tasks: ${taskError.message}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Business projects and tasks seeded successfully',
      data: {
        projects: projectData,
        tasks: taskData,
        projectsCount: projects.length,
        tasksCount: tasks.length
      }
    })

  } catch (error) {
    console.error('Database seeding error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}