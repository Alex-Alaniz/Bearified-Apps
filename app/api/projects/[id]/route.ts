import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Project, UpdateProjectData } from '@/lib/types/project'

// GET /api/projects/[id] - Get a specific project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        owner:users!projects_owner_id_fkey(id, name, email),
        members:project_members(
          id,
          role,
          joined_at,
          user:users!project_members_user_id_fkey(id, name, email)
        ),
        project_stats(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching project:', error)
      return NextResponse.json(
        { error: 'Failed to fetch project' },
        { status: 500 }
      )
    }

    // Transform the data to match our TypeScript interface
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
      members: data.members?.map((member: any) => ({
        id: member.id,
        projectId: id,
        userId: member.user.id,
        role: member.role,
        joinedAt: member.joined_at,
        user: member.user,
      })),
      taskCount: data.project_stats?.[0]?.total_tasks || 0,
      completedTaskCount: data.project_stats?.[0]?.completed_tasks || 0,
      inProgressTaskCount: data.project_stats?.[0]?.in_progress_tasks || 0,
      overdueTaskCount: data.project_stats?.[0]?.overdue_tasks || 0,
      teamSize: data.project_stats?.[0]?.team_size || 0,
      totalTimeMinutes: data.project_stats?.[0]?.total_time_minutes || 0,
    }

    return NextResponse.json({ data: project })

  } catch (error) {
    console.error('Error in project GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id] - Update a project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body: UpdateProjectData = await request.json()

    // Build update object
    const updateData: any = {}
    if (body.name !== undefined) updateData.name = body.name.trim()
    if (body.description !== undefined) updateData.description = body.description?.trim()
    if (body.status !== undefined) updateData.status = body.status
    if (body.priority !== undefined) updateData.priority = body.priority
    if (body.startDate !== undefined) updateData.start_date = body.startDate
    if (body.endDate !== undefined) updateData.end_date = body.endDate
    if (body.budget !== undefined) updateData.budget = body.budget
    if (body.color !== undefined) updateData.color = body.color
    if (body.icon !== undefined) updateData.icon = body.icon
    if (body.isArchived !== undefined) updateData.is_archived = body.isArchived

    // Validation
    if (updateData.name === '') {
      return NextResponse.json(
        { error: 'Project name cannot be empty' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        owner:users!projects_owner_id_fkey(id, name, email),
        project_stats(*)
      `)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        )
      }
      console.error('Error updating project:', error)
      return NextResponse.json(
        { error: 'Failed to update project' },
        { status: 500 }
      )
    }

    // Transform the response
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
      taskCount: data.project_stats?.[0]?.total_tasks || 0,
      completedTaskCount: data.project_stats?.[0]?.completed_tasks || 0,
      inProgressTaskCount: data.project_stats?.[0]?.in_progress_tasks || 0,
      overdueTaskCount: data.project_stats?.[0]?.overdue_tasks || 0,
      teamSize: data.project_stats?.[0]?.team_size || 0,
      totalTimeMinutes: data.project_stats?.[0]?.total_time_minutes || 0,
    }

    return NextResponse.json({
      data: project,
      message: 'Project updated successfully'
    })

  } catch (error) {
    console.error('Error in project PUT:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting project:', error)
      return NextResponse.json(
        { error: 'Failed to delete project' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Project deleted successfully'
    })

  } catch (error) {
    console.error('Error in project DELETE:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}