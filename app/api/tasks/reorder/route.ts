import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { TaskStatus } from '@/lib/types/project'

interface ReorderTasksRequest {
  taskId: string
  newColumn: TaskStatus
  newPosition: number
  projectId: string
}

// POST /api/tasks/reorder - Reorder tasks within or between columns
export async function POST(request: NextRequest) {
  try {
    const body: ReorderTasksRequest = await request.json()
    const { taskId, newColumn, newPosition, projectId } = body

    // Validation
    if (!taskId || !newColumn || newPosition === undefined || !projectId) {
      return NextResponse.json(
        { error: 'Missing required fields: taskId, newColumn, newPosition, projectId' },
        { status: 400 }
      )
    }

    // Start a transaction to ensure consistency
    const { data: taskData, error: taskError } = await supabase
      .from('tasks')
      .select('board_column, position')
      .eq('id', taskId)
      .single()

    if (taskError || !taskData) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    const oldColumn = taskData.board_column
    const oldPosition = taskData.position

    // If moving within the same column
    if (oldColumn === newColumn) {
      if (oldPosition === newPosition) {
        // No change needed
        return NextResponse.json({ message: 'No change needed' })
      }

      // Reorder within the same column
      if (oldPosition < newPosition) {
        // Moving down: decrease position of tasks between old and new position
        await supabase
          .from('tasks')
          .update({ position: supabase.sql`position - 1` })
          .eq('project_id', projectId)
          .eq('board_column', oldColumn)
          .gt('position', oldPosition)
          .lte('position', newPosition)
      } else {
        // Moving up: increase position of tasks between new and old position
        await supabase
          .from('tasks')
          .update({ position: supabase.sql`position + 1` })
          .eq('project_id', projectId)
          .eq('board_column', oldColumn)
          .gte('position', newPosition)
          .lt('position', oldPosition)
      }
    } else {
      // Moving between columns
      
      // Decrease position of tasks after the old position in the old column
      await supabase
        .from('tasks')
        .update({ position: supabase.sql`position - 1` })
        .eq('project_id', projectId)
        .eq('board_column', oldColumn)
        .gt('position', oldPosition)

      // Increase position of tasks at or after the new position in the new column
      await supabase
        .from('tasks')
        .update({ position: supabase.sql`position + 1` })
        .eq('project_id', projectId)
        .eq('board_column', newColumn)
        .gte('position', newPosition)
    }

    // Update the moved task
    const { data: updatedTask, error: updateError } = await supabase
      .from('tasks')
      .update({
        board_column: newColumn,
        position: newPosition,
        status: newColumn, // Update status to match column
      })
      .eq('id', taskId)
      .select(`
        *,
        assignee:users!tasks_assignee_id_fkey(id, name, email),
        project:projects!tasks_project_id_fkey(id, name, color)
      `)
      .single()

    if (updateError) {
      console.error('Error updating task position:', updateError)
      return NextResponse.json(
        { error: 'Failed to update task position' },
        { status: 500 }
      )
    }

    // Transform the response
    const task = {
      id: updatedTask.id,
      title: updatedTask.title,
      description: updatedTask.description,
      projectId: updatedTask.project_id,
      parentTaskId: updatedTask.parent_task_id,
      status: updatedTask.status,
      priority: updatedTask.priority,
      assigneeId: updatedTask.assignee_id,
      reporterId: updatedTask.reporter_id,
      createdAt: updatedTask.created_at,
      updatedAt: updatedTask.updated_at,
      dueDate: updatedTask.due_date,
      completedAt: updatedTask.completed_at,
      estimatedHours: updatedTask.estimated_hours,
      actualHours: updatedTask.actual_hours,
      boardColumn: updatedTask.board_column,
      position: updatedTask.position,
      storyPoints: updatedTask.story_points,
      labels: updatedTask.labels || [],
      assignee: updatedTask.assignee,
      project: updatedTask.project,
    }

    return NextResponse.json({
      data: task,
      message: 'Task reordered successfully'
    })

  } catch (error) {
    console.error('Error in tasks reorder:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}