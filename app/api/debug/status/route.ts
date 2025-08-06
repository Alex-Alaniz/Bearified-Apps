import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (error) {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        error: error.message,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'missing',
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'configured' : 'missing'
      })
    }

    // Test if users table exists and has data
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5)

    const usersCount = users?.length || 0

    // Test if project management tables exist
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('count')
      .limit(1)

    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('count')
      .limit(1)

    return NextResponse.json({
      status: 'connected',
      database: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co') ? 'valid' : 'invalid',
        connection: 'OK'
      },
      tables: {
        users: {
          exists: !usersError,
          count: usersCount,
          error: usersError?.message
        },
        projects: {
          exists: !projectsError,
          error: projectsError?.message
        },
        tasks: {
          exists: !tasksError,
          error: tasksError?.message
        }
      },
      sampleUsers: users?.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role })) || []
    })

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}