import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { CreateTaskData, Task, TaskFilters } from '@/lib/types/project'

// GET /api/tasks - Get tasks with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const assigneeId = searchParams.get('assigneeId')
    const search = searchParams.get('search')
    const labels = searchParams.get('labels')?.split(',').filter(Boolean)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')

    let query = supabase
      .from('tasks')
      .select(`
        *,
        project:projects!tasks_project_id_fkey(id, name, color),
        assignee:users!tasks_assignee_id_fkey(id, name, email),
        reporter:users!tasks_reporter_id_fkey(id, name, email),
        parent_task:tasks!tasks_parent_task_id_fkey(id, title)
      `)
      .order('position', { ascending: true })
      .order('created_at', { ascending: false })

    // Apply filters
    if (projectId) {
      query = query.eq('project_id', projectId)
    }
    if (status) {
      query = query.eq('status', status)
    }
    if (priority) {
      query = query.eq('priority', priority)
    }
    if (assigneeId) {
      query = query.eq('assignee_id', assigneeId)
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }
    if (labels && labels.length > 0) {
      query = query.overlaps('labels', labels)
    }

    // Apply pagination
    const start = (page - 1) * pageSize
    const end = start + pageSize - 1
    query = query.range(start, end)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching tasks:', error)
      return NextResponse.json(
        { error: 'Failed to fetch tasks' },
        { status: 500 }
      )
    }

    // Transform the data to match our TypeScript interfaces
    const tasks: Task[] = data?.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      projectId: task.project_id,
      parentTaskId: task.parent_task_id,
      status: task.status,
      priority: task.priority,
      assigneeId: task.assignee_id,
      reporterId: task.reporter_id,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
      dueDate: task.due_date,
      completedAt: task.completed_at,
      estimatedHours: task.estimated_hours,
      actualHours: task.actual_hours,
      boardColumn: task.board_column,
      position: task.position,
      storyPoints: task.story_points,
      labels: task.labels || [],
      project: task.project,
      assignee: task.assignee,
      reporter: task.reporter,
      parentTask: task.parent_task,
    })) || []

    return NextResponse.json({
      data: tasks,
      total: count || 0,
      page,
      pageSize,
      hasMore: count ? count > page * pageSize : false
    })

  } catch (error) {
    console.error('Error in tasks GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body: CreateTaskData = await request.json()

    // Basic validation
    if (!body.title?.trim()) {
      return NextResponse.json(
        { error: 'Task title is required' },
        { status: 400 }
      )
    }

    if (!body.projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    // For now, we'll use a mock user ID for reporter - in production this would come from auth
    const mockUserId = 'alex@alexalaniz.com'

    // Get the actual user ID from the users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', mockUserId)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    // Get the next position for this board column
    const { data: maxPositionData } = await supabase
      .from('tasks')
      .select('position')
      .eq('project_id', body.projectId)
      .eq('board_column', body.boardColumn || 'todo')
      .order('position', { ascending: false })
      .limit(1)

    const nextPosition = (maxPositionData?.[0]?.position || 0) + 1

    const taskData = {
      title: body.title.trim(),
      description: body.description?.trim(),
      project_id: body.projectId,
      parent_task_id: body.parentTaskId,
      priority: body.priority || 'medium',
      assignee_id: body.assigneeId,
      reporter_id: userData.id,
      due_date: body.dueDate,
      estimated_hours: body.estimatedHours,
      board_column: body.boardColumn || 'todo',
      position: nextPosition,
      story_points: body.storyPoints,
      labels: body.labels || [],
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([taskData])
      .select(`
        *,
        project:projects!tasks_project_id_fkey(id, name, color),
        assignee:users!tasks_assignee_id_fkey(id, name, email),
        reporter:users!tasks_reporter_id_fkey(id, name, email)
      `)
      .single()

    if (error) {
      console.error('Error creating task:', error)
      return NextResponse.json(
        { error: 'Failed to create task' },
        { status: 500 }
      )
    }

    // Transform the response to match our TypeScript interface
    const task: Task = {
      id: data.id,
      title: data.title,
      description: data.description,
      projectId: data.project_id,
      parentTaskId: data.parent_task_id,
      status: data.status,
      priority: data.priority,
      assigneeId: data.assignee_id,
      reporterId: data.reporter_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      dueDate: data.due_date,
      completedAt: data.completed_at,
      estimatedHours: data.estimated_hours,
      actualHours: data.actual_hours,
      boardColumn: data.board_column,
      position: data.position,
      storyPoints: data.story_points,
      labels: data.labels || [],
      project: data.project,
      assignee: data.assignee,
      reporter: data.reporter,
    }

    return NextResponse.json({
      data: task,
      message: 'Task created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error in tasks POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}