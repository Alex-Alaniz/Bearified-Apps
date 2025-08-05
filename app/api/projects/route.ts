import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { CreateProjectData, Project, ProjectFilters } from '@/lib/types/project'

// GET /api/projects - Get all projects for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const search = searchParams.get('search')
    const isArchived = searchParams.get('archived') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')

    let query = supabase
      .from('projects')
      .select(`
        *,
        owner:users!projects_owner_id_fkey(id, name, email),
        project_stats(*)
      `)
      .eq('is_archived', isArchived)
      .order('created_at', { ascending: false })

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }
    if (priority) {
      query = query.eq('priority', priority)
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply pagination
    const start = (page - 1) * pageSize
    const end = start + pageSize - 1
    query = query.range(start, end)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching projects:', error)
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500 }
      )
    }

    // Transform the data to match our TypeScript interfaces
    const projects: Project[] = data?.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      priority: project.priority,
      startDate: project.start_date,
      endDate: project.end_date,
      createdAt: project.created_at,
      updatedAt: project.updated_at,
      progressPercentage: project.progress_percentage,
      budget: project.budget,
      ownerId: project.owner_id,
      organizationId: project.organization_id,
      isArchived: project.is_archived,
      isTemplate: project.is_template,
      color: project.color,
      icon: project.icon,
      owner: project.owner,
      taskCount: project.project_stats?.[0]?.total_tasks || 0,
      completedTaskCount: project.project_stats?.[0]?.completed_tasks || 0,
      inProgressTaskCount: project.project_stats?.[0]?.in_progress_tasks || 0,
      overdueTaskCount: project.project_stats?.[0]?.overdue_tasks || 0,
      teamSize: project.project_stats?.[0]?.team_size || 0,
      totalTimeMinutes: project.project_stats?.[0]?.total_time_minutes || 0,
    })) || []

    return NextResponse.json({
      data: projects,
      total: count || 0,
      page,
      pageSize,
      hasMore: count ? count > page * pageSize : false
    })

  } catch (error) {
    console.error('Error in projects GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const body: CreateProjectData = await request.json()

    // Basic validation
    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      )
    }

    // For now, we'll use a mock user ID - in production this would come from auth
    // TODO: Replace with actual authentication
    const mockUserId = 'alex@alexalaniz.com' // This should be replaced with auth.uid()

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

    const projectData = {
      name: body.name.trim(),
      description: body.description?.trim(),
      priority: body.priority || 'medium',
      start_date: body.startDate,
      end_date: body.endDate,
      budget: body.budget,
      color: body.color || '#3B82F6',
      icon: body.icon || 'folder',
      owner_id: userData.id,
    }

    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select(`
        *,
        owner:users!projects_owner_id_fkey(id, name, email)
      `)
      .single()

    if (error) {
      console.error('Error creating project:', error)
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: 500 }
      )
    }

    // Transform the response to match our TypeScript interface
    const project: Project = {
      id: data.id,
      name: data.name,
      description: data.description,
      status: data.status,
      priority: data.priority,
      startDate: data.start_date,
      endDate: data.end_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      progressPercentage: data.progress_percentage,
      budget: data.budget,
      ownerId: data.owner_id,
      organizationId: data.organization_id,
      isArchived: data.is_archived,
      isTemplate: data.is_template,
      color: data.color,
      icon: data.icon,
      owner: data.owner,
      taskCount: 0,
      completedTaskCount: 0,
      inProgressTaskCount: 0,
      overdueTaskCount: 0,
      teamSize: 1,
      totalTimeMinutes: 0,
    }

    return NextResponse.json({
      data: project,
      message: 'Project created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error in projects POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}