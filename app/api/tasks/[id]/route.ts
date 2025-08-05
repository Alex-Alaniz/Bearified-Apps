import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Task, UpdateTaskData } from '@/lib/types/project'

// GET /api/tasks/[id] - Get a specific task
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        project:projects!tasks_project_id_fkey(id, name, color),
        assignee:users!tasks_assignee_id_fkey(id, name, email),
        reporter:users!tasks_reporter_id_fkey(id, name, email),
        parent_task:tasks!tasks_parent_task_id_fkey(id, title),
        subtasks:tasks!tasks_parent_task_id_fkey(id, title, status, priority),
        comments:task_comments(
          id,
          content,
          created_at,
          updated_at,
          is_edited,
          user:users!task_comments_user_id_fkey(id, name, email)
        ),
        attachments:task_attachments(
          id,
          file_name,
          file_url,
          file_size,
          mime_type,
          created_at,
          user:users!task_attachments_user_id_fkey(id, name, email)
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Task not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching task:', error)
      return NextResponse.json(
        { error: 'Failed to fetch task' },
        { status: 500 }
      )
    }

    // Transform the data to match our TypeScript interface
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
      parentTask: data.parent_task,
      subtasks: data.subtasks?.map((subtask: any) => ({
        id: subtask.id,
        title: subtask.title,
        status: subtask.status,
        priority: subtask.priority,
      })),
      comments: data.comments?.map((comment: any) => ({
        id: comment.id,
        taskId: id,
        userId: comment.user.id,
        content: comment.content,
        createdAt: comment.created_at,
        updatedAt: comment.updated_at,
        isEdited: comment.is_edited,
        user: comment.user,
      })),
      attachments: data.attachments?.map((attachment: any) => ({
        id: attachment.id,
        taskId: id,
        userId: attachment.user.id,
        fileName: attachment.file_name,
        fileUrl: attachment.file_url,
        fileSize: attachment.file_size,
        mimeType: attachment.mime_type,
        createdAt: attachment.created_at,
        user: attachment.user,
      })),
    }

    return NextResponse.json({ data: task })

  } catch (error) {
    console.error('Error in task GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/tasks/[id] - Update a task
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body: UpdateTaskData = await request.json()

    // Build update object
    const updateData: any = {}
    if (body.title !== undefined) updateData.title = body.title.trim()
    if (body.description !== undefined) updateData.description = body.description?.trim()
    if (body.status !== undefined) updateData.status = body.status
    if (body.priority !== undefined) updateData.priority = body.priority
    if (body.assigneeId !== undefined) updateData.assignee_id = body.assigneeId
    if (body.dueDate !== undefined) updateData.due_date = body.dueDate
    if (body.estimatedHours !== undefined) updateData.estimated_hours = body.estimatedHours
    if (body.boardColumn !== undefined) updateData.board_column = body.boardColumn
    if (body.position !== undefined) updateData.position = body.position
    if (body.storyPoints !== undefined) updateData.story_points = body.storyPoints
    if (body.labels !== undefined) updateData.labels = body.labels

    // Validation
    if (updateData.title === '') {
      return NextResponse.json(
        { error: 'Task title cannot be empty' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        project:projects!tasks_project_id_fkey(id, name, color),
        assignee:users!tasks_assignee_id_fkey(id, name, email),
        reporter:users!tasks_reporter_id_fkey(id, name, email)
      `)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Task not found' },
          { status: 404 }
        )
      }
      console.error('Error updating task:', error)
      return NextResponse.json(
        { error: 'Failed to update task' },
        { status: 500 }
      )
    }

    // Transform the response
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
      message: 'Task updated successfully'
    })

  } catch (error) {
    console.error('Error in task PUT:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting task:', error)
      return NextResponse.json(
        { error: 'Failed to delete task' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Task deleted successfully'
    })

  } catch (error) {
    console.error('Error in task DELETE:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}