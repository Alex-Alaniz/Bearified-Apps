import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Get user count from Supabase if users table exists
    const { count: userCount, error: userError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    // Get project count
    const { count: projectCount, error: projectError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })

    // Get task count
    const { count: taskCount, error: taskError } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })

    // Get active projects count
    const { count: activeProjectCount, error: activeProjectError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    return NextResponse.json({
      userCount: userError ? 1 : (userCount || 1), // Default to at least 1 (current user)
      projectCount: projectError ? 0 : (projectCount || 0),
      taskCount: taskError ? 0 : (taskCount || 0),
      activeProjectCount: activeProjectError ? 0 : (activeProjectCount || 0),
      databaseConnected: !userError,
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({
      userCount: 1, // At least the current admin user
      projectCount: 0,
      taskCount: 0,
      activeProjectCount: 0,
      databaseConnected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      lastUpdated: new Date().toISOString()
    })
  }
}