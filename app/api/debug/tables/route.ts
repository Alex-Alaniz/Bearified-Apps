import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Check database connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(1)

    if (connectionError) {
      console.error('Database connection error:', connectionError)
      return NextResponse.json({
        error: 'Database connection failed',
        details: connectionError.message
      }, { status: 500 })
    }

    // Get all tables in public schema
    const { data: tables, error: tablesError } = await supabase.rpc('get_public_tables', {})
    
    if (tablesError) {
      // Fallback method if RPC doesn't work
      console.log('RPC method failed, trying direct query...')
      
      // Try a more direct approach
      const { data: directTables, error: directError } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public')

      if (directError) {
        console.error('Direct table query error:', directError)
        return NextResponse.json({
          error: 'Could not fetch tables',
          details: directError.message,
          connection: 'OK'
        }, { status: 500 })
      }

      return NextResponse.json({
        connection: 'OK',
        tables: directTables?.map(t => t.tablename) || [],
        method: 'direct_query'
      })
    }

    return NextResponse.json({
      connection: 'OK',
      tables: tables || [],
      method: 'rpc'
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({
      error: 'Unexpected error occurred',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}